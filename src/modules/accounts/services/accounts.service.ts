import * as _ from 'lodash';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { uuid } from 'uuidv4';
import { HttpService } from '@nestjs/axios';
import config from '../../../config';
import { AccountsRepository } from '../repositories/accounts.repository';
import { ConnectDto } from '../../auth/dto/connect.dto';
import { CreateAgentDto } from '../dto/create-agent.dto';
import { CreateArtistDto } from '../dto/create-artist.dto';
import { VerifyUrlRequestDto } from '../dto/verify-url.request.dto';
import { VerifyUrlResponseDto } from '../dto/verify-url.response.dto';
import { VerifyTwitterRequestDto } from '../dto/verify-twitter.request.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { AgentsService } from '../../agents/services/agents.service';
import { ArtistsService } from '../../artists/services/artists.service';
import { UploadFileDto } from '../dto/upload-file.dto';
import { StorageService } from '../../storage/services/storage.service';
import { CurrentSessionAccount } from '../../../common/decorators/current-account.decorator';
import { FileTypeEnum } from '../../storage/enums/file-type.enum';

@Injectable()
export class AccountsService {
  constructor(
    private readonly accountRepository: AccountsRepository,
    private readonly agentsService: AgentsService,
    private readonly artistsService: ArtistsService,
    private readonly storageService: StorageService,
    private httpService: HttpService,
  ) {
  }

  async findOneByEmail(email: string) {
    return this.accountRepository.findOneByParams({ email });
  }

  async findOneByArtistId(artistId: number) {
    return this.accountRepository.findOneByParams({ artistId });
  }

  async findOneByAgentId(agentId: number) {
    return this.accountRepository.findOneByParams({ agentId });
  }

  async findOne(id: number) {
    return this.accountRepository.findOne(id);
  }

  async findOneByIdOrSlug(slug: number | string) {
    const item = await this.accountRepository.findOneByIdOrSlug(slug);
    if (!item) {
      throw new NotFoundException('Account not found');
    }
    return item;
  }

  async findOneByAddressPrivate(address: string) {
    return this.accountRepository.findOneByAddressPrivate(address);
  }

  async findOneByAddress(address: string) {
    return this.accountRepository.findOneByAddress(address);
  }

  async getNonce(address: string) {
    return this.accountRepository.getNonce(address);
  }

  async updateNonce(address: string) {
    const nonce = uuid();
    return this.accountRepository.updateNonce(address, nonce);
  }

  async create(dto: ConnectDto) {
    return this.accountRepository.create({
      ...dto,
      nonce: uuid(),
    });
  }

  bulkCreate(data: { address: string }[]) {
    return this.accountRepository.bulkCreate(_.map(data, ({ address }) => ({ address, nonce: uuid() })));
  }

  async update(address: string, dto: UpdateAccountDto) {
    // TODO: add check current account access
    return this.accountRepository.update(address, dto);
  }

  async createAgent(address: string, dto: CreateAgentDto) {
    const account = await this.accountRepository.findOneByAddressPrivate(address);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    if (account.agent) {
      throw new ConflictException('You already applied as an agent!');
    }

    const agent = await this.agentsService.create({
      accountId: account.id,
      default_fee: null,
      verified: false,
    });
    return this.update(address, {
      ...dto,
      agent: agent.id,
      agentId: agent.id,
    });
  }

  async createEmptyArtist(currentAccount: CurrentSessionAccount) {
    const artist = await this.artistsService.create({
      accountId: currentAccount.id,
      first_name: '',
      last_name: '',
      social_media: '',
      art_type: '',
      status: 'pending',
    });
    return this.update(currentAccount.address, {
      artistId: artist.id,
    });
  }

  async createArtist(files: Array<Express.Multer.File>, address: string, dto: CreateArtistDto) {
    let account = await this.accountRepository.findOneByAddressPrivate(address);
    let artist = await this.artistsService.findOneByParams({ accountId: account.id });
    const accountByEmail = await this.accountRepository.findOneByEmail(dto.email);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    if (accountByEmail && accountByEmail.id !== account.id) {
      throw new ConflictException('Email address is already in use by another wallet address!');
    }
    if (artist && artist.status != 'pending') {
      throw new ConflictException('You already applied as an artist!');
    }
    let bestWorks = [];

    if (files.length) {
      bestWorks = await this.uploadFiles(files);
    }

    if (!artist) {
      artist = await this.artistsService.create({
        accountId: account.id,
        first_name: dto.first_name,
        last_name: dto.last_name,
        social_media: dto.social_media,
        art_type: dto.art_type,
        bestWorks,
        status: 'pending',
      });
    } else {
      artist = await this.artistsService.update(artist.id, {
        accountId: account.id,
        first_name: dto.first_name,
        last_name: dto.last_name,
        social_media: dto.social_media,
        art_type: dto.art_type,
        bestWorks,
        status: 'pending',
      });
    }

    account = await this.update(address, {
      ...dto,
      artist: artist.id,
      artistId: artist.id,
    });
    return account;
    // TODO: send email notifications
  }

  async verifyUrl(dto: VerifyUrlRequestDto): Promise<VerifyUrlResponseDto> {
    let status = false;
    try {
      const res = await this.httpService.get(dto.url).toPromise();
      status = res.status === 200;
    } catch (error) {
      status = false;
    }
    return {
      status,
    };
  }

  async verifyTweet(address: string, dto: VerifyTwitterRequestDto) {
    // TODO: add check current account access
    let account = await this.accountRepository.findOneByAddressPrivate(address);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    let verified = false;
    const res = await this.httpService.get(`${config.scrapper.url}/fetchtweet?url=${dto.url}`).toPromise();
    if (res?.data?.tweet) {
      verified = res.data.tweet.indexOf(dto.token) >= 0;
    }
    const twitter = this.getTwitterUsernameFromLink(dto.url);
    account = await this.update(address, { twitter });
    return { verified: verified, username: twitter, account };
  }

  async uploadFile(files: Array<Express.Multer.File>, dto: UploadFileDto, currentAccount: CurrentSessionAccount) {
    const [file] = files;
    if (!file) {
      throw new BadRequestException('There is no file in the files field!');
    }
    const { Location } = await this.storageService.uploadFile(file, file.originalname);
    if (Location) {
      let updateData = null;
      if (dto.field === FileTypeEnum.avatar) {
        updateData = { avatar: Location };
      }
      if (dto.field === FileTypeEnum.background) {
        updateData = { background: Location };
      }
      if (updateData) {
        return this.update(currentAccount.address, updateData);
      }
      throw new BadRequestException('Invalid "field" field');
    }
  }

  //============================================//
  private getTwitterUsernameFromLink(url) {

    const twitterStatusPattern = /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/gm;
    let username = '';

    const matches = twitterStatusPattern.exec(url);
    if (!matches || matches.length < 2)
      return 'Invalid url';

    if (!matches[1])
      return 'Error extracting username from url';
    username = '@' + matches[1];
    return username;
  }

  private async uploadFiles(files: Array<Express.Multer.File>): Promise<string[]> {
    const results = await Promise.all(
      files.map(file => this.storageService.uploadFile(file, file.originalname)),
    );
    return results.map(r => r.Location);
  }

}
