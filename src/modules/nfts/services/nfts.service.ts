import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable, NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { uuid } from 'uuidv4';
import * as _ from 'lodash';
import { UpdateNftDto } from '../dto/update-nft.dto';
import { CreateNftDto } from '../dto/create-nft.dto';
import { NftsRepository } from '../repositories/nfts.repository';
import { GetListNftDto } from '../dto/get-list-nft.dto';
import { PutOnSaleDto } from '../dto/put-on-sale.dto';
import { AccountsService } from '../../accounts/services/accounts.service';
import { BidsService } from '../../bids/services/bids.service';
import { PlaceBidDto } from '../dto/place-bid.dto';
import { NftTypeEnum } from '../enums/nft-type.enum';
import { WebSocketGateway } from 'common/modules/web-socket/web-socket.gateway';
import { SocketEventsName } from '../../../common/constants/socket-events-names.enum';
import { CreateEventsNftDto } from '../dto/create-events-nft.dto';
import { BidCreatedEvent } from '../events/bid-created.event';
import { NftPurchasedEvent } from '../events/nft-purchased.event';
import { CurrentSessionAccount } from '../../../common/decorators/current-account.decorator';
import config from '../../../config';
import { exchangeRatesOnline, getCurrencyAddress, toWei } from 'common/utils/functions';
import { currencyOptions } from '../../../common/constants';
import { CustomLogger } from '@opengeekslab_llc/nest-custom-logger';
import { OffersService } from '../../offers/services/offers.service';
import { AcceptOfferDto } from '../dto/accept-offer.dto';
import { NftReferralsRepository } from '../repositories/nft-referrals.repository';
import { GetListBidDto } from '../../bids/dto/get-list-bid.dto';
import {
  NFTMarketSolidContract,
} from '../../../common/blockchain/contracts/nft-market-solid/NFT-market-solid.contract';

@Injectable()
export class NftsService {
  logger = CustomLogger(NftsService.name);

  constructor(
    private readonly nftRepository: NftsRepository,
    private readonly nftReferralsRepository: NftReferralsRepository,
    private readonly bidService: BidsService,
    private readonly accountService: AccountsService,
    private readonly offersService: OffersService,
    private readonly nftMarketSolidContract: NFTMarketSolidContract,
    private readonly webSocketGateway: WebSocketGateway,
    private readonly eventEmitter: EventEmitter2,
  ) {
  }

  async findMyAll(getListNftDto: GetListNftDto) {
    return this.nftRepository.findMyAll(getListNftDto);
  }

  /**
   * Has Private data!!!
   * @param getListNftDto
   * @param scope
   */
  async findAll(getListNftDto: GetListNftDto, scope?: string) {
    return this.nftRepository.findAll(getListNftDto, scope);
  }

  async marketList(getListNftDto: GetListNftDto) {
    getListNftDto.is_minted = true;
    return this.nftRepository.findAll(getListNftDto, 'publicList');
  }

  async findOne(id: number, currentAccount?: CurrentSessionAccount) {
    return this.nftRepository.findOne(id, currentAccount?.id);
  }

  async countBids(id: number) {
    try {
      const count = await this.bidService.count(id);
      const lastAddedAtDate = await this.bidService.getLastBidTime(id);
      return {
        count,
        lastAddedAt: +lastAddedAtDate,
      };
    } catch (e) {
      this.logger.log(e.message, e.stack);
      throw new BadRequestException(e.message);
    }
  }

  async getHighestAndFirst(id: string) {
    return this.bidService.getHighestAndFirst(id);
  }

  async getBids(id: number, getListBidDto: GetListBidDto) {
    const nft = await this.findOne(id);
    if (!nft) {
      throw new NotFoundException('NFT not found');
    }
    if (nft.type !== NftTypeEnum.auction) {
      throw new ConflictException('Bids are only available for the default auction!');
    }
    return this.bidService.findAllByNftId(nft.id, getListBidDto);
  }

  async placeBid(id: number, dto: PlaceBidDto, currentAccount: CurrentSessionAccount) {
    await this.accountService.updateNonce(currentAccount.address);
    if (!currentAccount) {
      throw new ForbiddenException('Not found account');
    }
    const nft = await this.nftRepository.findOne(id);
    if (!nft) {
      throw new ForbiddenException('Not found auction');
    }
    if (Number(nft.bid) > Number(dto.amount)) {
      throw new BadRequestException(`Your bid cannot be less than the minimum bid: ${nft.bid}`);
    }
    if (+nft.start_date > Date.now()) {
      throw new ConflictException('Auction has not started!');
    }
    if (+nft.start_date + (nft.end_date * 1000) < Date.now()) {
      throw new ConflictException('Auction ended!');
    }

    let referralId = undefined;
    if (dto.referral) {
      const ref = await this.nftReferralsRepository.findOneForNftByRef(nft.id, dto.referral);
      if (ref) {
        referralId = ref.id;
      }
    }
    dto = _.omit(dto, ['referral']);

    const data = await this.bidService.placeBid({
      ...dto,
      auction_id: id,
      bidder_id: currentAccount.id,
      bidder_address: currentAccount.address,
      referralId,
    });

    if (nft.highest_bid < dto.amount) {
      await this.nftRepository.update(
        nft.id,
        {
          highest_bid: dto.amount,
        },
        nft.accountId,
      );
    }

    this.webSocketGateway.emit(SocketEventsName.BIT_PLACED, {
      nftId: id,
      bidder_id: currentAccount.id,
      bidder_address: currentAccount.address,
      bitId: data.id,
      createdAt: data.createdAt,
    });

    this.eventEmitter.emit(
      'bid.created',
      new BidCreatedEvent({
        id: data.id,
        nftName: nft.name,
        bidderId: currentAccount.id,
        sellerId: nft.accountId,
        amount: data.amount,
        currency: data.currency,
      }),
    );

    return data;
  }

  async create(createNtfDto: CreateNftDto, currentAccount: CurrentSessionAccount) {
    createNtfDto.contractAddress ??= config.blockchain.contracts.NFTMarketSolidAddress;
    return this.nftRepository.create(createNtfDto, currentAccount.id);
  }

  async createCollectedNTFList(nftList: CreateEventsNftDto[]) {
    return this.nftRepository.createCollectedNTFList(nftList);
  }

  async update(id: number, updateNtfDto: UpdateNftDto, currentAccount: CurrentSessionAccount) {
    await this.accountService.updateNonce(currentAccount.address);
    return this.nftRepository.update(id, updateNtfDto, currentAccount.id);
  }

  async putOnSale(id: number, putOnSaleDto: PutOnSaleDto, currentAccount: CurrentSessionAccount) {
    if (putOnSaleDto.type === NftTypeEnum.fixed) {
      putOnSaleDto.bid = 0;
      putOnSaleDto.start_date = null;
      putOnSaleDto.end_date = null;
    } else {
      putOnSaleDto.price = 0;
      putOnSaleDto.signature = null;
      putOnSaleDto.nonce = null;
    }
    const nft = await this.nftRepository.update(id, { ...putOnSaleDto, on_sale: true }, currentAccount.id);
    if (!nft.contractAddress) {
      throw new ConflictException('NFT does not have a contract address, so it cannot be put up for sale. Contact the site administration.');
    }
    return nft;
  }

  async removeFromSale(id: number, currentAccount: CurrentSessionAccount) {
    let count;
    try {
      await this.accountService.updateNonce(currentAccount.address);
      count = await this.bidService.count(id);
    } catch (e) {
      this.logger.log(e.message, e.stack);
      throw new BadRequestException(e.message);
    }
    if (count) {
      throw new ConflictException('You cannot remove a lot with bids from sale!');
    }
    const nft = await this.nftRepository.update(id, {
      on_sale: false,
      signature: null,
      nonce: null,
    }, currentAccount.id);
    await this.nftReferralsRepository.deleteAllByNftId(id);
    return nft;
  }

  async cancelSale(id: number, currentAccount: CurrentSessionAccount) {
    await this.accountService.updateNonce(currentAccount.address);
    const nft = await this.nftRepository.update(id, {
      on_sale: false,
      signature: null,
      nonce: null,
    }, currentAccount.id);
    await this.bidService.closeAllBids(id);
    await this.nftReferralsRepository.deleteAllByNftId(id);
    return nft;
  }

  async transfer(id: number, updateNtfDto: UpdateNftDto, currentAccount: CurrentSessionAccount) {
    await this.accountService.updateNonce(currentAccount.address);
    // TODO: Refactoring needed: it is necessary to guarantee the nft translation to the winner. But you need to take the address to which the nft is translated
    const item = await this.findOne(id);
    if (item.type === NftTypeEnum.fixed) {
      updateNtfDto.account = Number(currentAccount.id);
      updateNtfDto.accountId = Number(currentAccount.id);
      updateNtfDto.signature = null;
      updateNtfDto.nonce = null;
    }
    const nft = await this.nftRepository.transfer(id, updateNtfDto);
    await this.bidService.closeAllBids(id);
    await this.nftReferralsRepository.deleteAllByNftId(id);
    await this.offersService.rejectAllForNft(id);
    if (item.type === NftTypeEnum.fixed) {
      this.eventEmitter.emit(
        'nft.purchased',
        new NftPurchasedEvent({
          id: item.id,
          nftName: item.name,
          customerId: currentAccount.id,
          sellerId: item.accountId,
          amount: item.price,
          currency: item.currency,
        }),
      );
    }
    return nft;
  }

  async acceptOfferAndTransfer(id: number, dto: AcceptOfferDto, currentAccount: CurrentSessionAccount) {
    await this.offersService.accept(dto.offerId, currentAccount);
    return this.transfer(id, dto, currentAccount);
  }

  async delete(id: number) {
    await this.nftRepository.delete(id);
  }

  async finishAuctions(accessToken: string, privateKey: string) {
    if (!config?.webhook?.authFinishAuctionToken || config.webhook.authFinishAuctionToken !== accessToken) {
      return;
    }

    const currencies = currencyOptions.map(c => c.originalName).join(',');
    const convertedCurrencies = await exchangeRatesOnline(currencies, 'eth'); // TODO: move 'eth' to env

    const highestBids = currencyOptions.map(c => {
      if (!convertedCurrencies[c.originalName]?.eth) {
        return null;
      }
      return {
        currency: c.name,
        highest_bid: Number(config.blockchain.highest_bid_eth_without_fee) / convertedCurrencies[c.originalName].eth,
      };
    }).filter(el => el);

    const nfts = await this.nftRepository.findAllExpiredAuctions(highestBids);

    Promise.all(nfts.map(async nft => {
      try {
        const winnersBet = await this.bidService.getHighestAndFirst(nft.id);
        if (winnersBet) {
          const res = await this.nftMarketSolidContract.createInstance(nft.chain.contractAddress, nft.chain.httProviderAddress).addWallet(privateKey)
            .finishSale(
              {
                nftId: nft.id,
                nftTokenId: nft.token_id,
                brokerFee: nft.brokerFee * 10,
                price: toWei(winnersBet.amount),
                amount: 1,
                nonce: +winnersBet.nonce,
                saleType: 1,
                sender: nft.account.address,
                brokerAddress: '', // TODO: add broker address
                recipient: winnersBet.bidder_address,
                currencyAddress: getCurrencyAddress(winnersBet.currency.toLowerCase()),
                signature: winnersBet.signature,
              },
              privateKey,
            );
          if (res) {
            await this.nftRepository.transfer(nft.id, {
              accountId: winnersBet.bidder_id,
              on_sale: false,
              highest_bid: 0,
              signature: null,
              nonce: null,
            });
            await this.bidService.closeAllBids(nft.id);
          }
          return res;
        }
      } catch (e) {
        this.logger.error(`Cant finish auction for ${nft.id}: ${e.message}`, e.stack);
      }
    }))
      .then(() => {
        this.logger.log('Auctions completed successfully');
      })
      .catch((e) => {
        this.logger.error('Cant finish auctions', e.message);
      });
  }

  async findReferralLink(id: number, ref: string) {
    return this.nftReferralsRepository.findOneForNftByRef(id, ref);
  }

  async generateReferralLink(id: number, currentAccount: CurrentSessionAccount) {
    const nft = await this.nftRepository.findOne(id);
    if (!nft || !nft.is_minted) {
      throw new ConflictException('You cannot generate a referral link to a non-existent NFT');
    }
    if (!nft.brokerFee) {
      throw new ConflictException('The owner has not set a reward for selling this NFT through a referral link');
    }
    const ref = uuid();

    return this.nftReferralsRepository.create({
      ref,
      accountId: currentAccount.id,
      nftId: id,
    });
  }
}
