import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AccountsService } from './services/accounts.service';
import { GetListAccountsDto } from './dto/get-list-accounts.dto';
import { CreateAgentDto } from './dto/create-agent.dto';
import { CreateArtistDto } from './dto/create-artist.dto';
import { VerifyUrlRequestDto } from './dto/verify-url.request.dto';
import { VerifyUrlResponseDto } from './dto/verify-url.response.dto';
import { VerifyTwitterRequestDto } from './dto/verify-twitter.request.dto';
import { VerifyTwitterResponseDto } from './dto/verify-twitter.response.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentAccount, CurrentSessionAccount } from '../../common/decorators/current-account.decorator';
import { UploadFileDto } from './dto/upload-file.dto';
import { AccountDto } from './dto/account.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SignatureGuard } from '../auth/guards/signature.guard';

@ApiTags('Accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {
  }

  @Get('')
  async findAll(@Query() dto: GetListAccountsDto) {
    // TODO: add implementation
    return [];
  }

  @Get(':address')
  async findOneByAddress(@Param('address') address: string) {
    return this.accountsService.findOneByAddress(address);
  }

  @Get('/by-id/:id')
  async findOne(@Param('id') id: number) {
    return this.accountsService.findOne(id);
  }

  @Get('/by-id-or-slug/:slug')
  async findOneByIdOrSlug(@Param('slug') slug: number | string) {
    return this.accountsService.findOneByIdOrSlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(SignatureGuard)
  @Put('/:address')
  async update(@Param('address') address: string, @Body() dto: UpdateAccountDto) {
    return this.accountsService.update(address, dto);
  }

  @ApiOkResponse({ type: VerifyUrlResponseDto })
  @UseGuards(JwtAuthGuard)
  @Post('/verify-url')
  async verifyUrl(@Body() dto: VerifyUrlRequestDto): Promise<VerifyUrlResponseDto> {
    return this.accountsService.verifyUrl(dto);
  }

  @ApiOkResponse({ type: VerifyTwitterResponseDto })
  @UseGuards(JwtAuthGuard)
  @UseGuards(SignatureGuard)
  @Post('/verify-tweet')
  async verifyTweet(@Body() dto: VerifyTwitterRequestDto, @CurrentAccount() currentAccount: any) {
    return this.accountsService.verifyTweet(currentAccount.address, dto);
  }

  @ApiBody({ type: CreateAgentDto, description: 'Create agent' })
  @UseGuards(JwtAuthGuard)
  @UseGuards(SignatureGuard)
  @Post('/:address/agent')
  async createAgent(@Param('address') address: string, @Body() dto: CreateAgentDto) {
    return this.accountsService.createAgent(address, dto);
  }

  @ApiBody({ type: CreateArtistDto, description: 'Create or update artist' })
  @UseGuards(JwtAuthGuard)
  @UseGuards(SignatureGuard)
  @Put('/:address/artist')
  @UseInterceptors(FilesInterceptor('files'))
  async createArtist(@UploadedFiles() files: Array<Express.Multer.File>, @Param('address') address: string, @Body() dto: CreateArtistDto) {
    return this.accountsService.createArtist(files, address, dto);
  }

  @ApiOkResponse({ type: AccountDto })
  @ApiBody({ type: UploadFileDto })
  @UseGuards(JwtAuthGuard)
  @UseGuards(SignatureGuard)
  @Post('/:address/upload-file')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>, @Body() dto: UploadFileDto, @CurrentAccount() currentAccount: CurrentSessionAccount) {
    return this.accountsService.uploadFile(files, dto, currentAccount);
  }

}
