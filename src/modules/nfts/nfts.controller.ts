import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { NftsService } from './services/nfts.service';
import { CreateNftDto } from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import { GetListNftDto } from './dto/get-list-nft.dto';
import { CurrentAccount, CurrentSessionAccount } from '../../common/decorators/current-account.decorator';
import { PutOnSaleDto } from './dto/put-on-sale.dto';
import { PlaceBidDto } from './dto/place-bid.dto';
import { CountBidResponseDto } from './dto/count-bid.response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NftDto } from './dto/nft.dto';
import { SignatureGuard } from '../auth/guards/signature.guard';
import { AcceptOfferDto } from './dto/accept-offer.dto';
import { ReferralLinkDto } from './dto/referral-link.dto';
import { GetListBidDto } from '../bids/dto/get-list-bid.dto';

@ApiTags('NFT')
@Controller('nfts')
export class NftsController {
  constructor(private readonly nftService: NftsService) {
  }

  @ApiOkResponse({ type: [NftDto] })
  @Get('')
  findAll(@Query() getListNftDto: GetListNftDto) {
    return this.nftService.marketList(getListNftDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [NftDto] })
  @Get('/my')
  findMyAll(@Query() getListNftDto: GetListNftDto, @CurrentAccount() currentAccount?: CurrentSessionAccount) {
    return this.nftService.findMyAll({
      ...getListNftDto,
      currentAccountId: +currentAccount.id,
      currentAccountAddress: currentAccount.address,
    });
  }

  @ApiOkResponse({ type: NftDto })
  @Get(':id')
  findOne(@Param('id') id: number, @CurrentAccount() currentAccount?: CurrentSessionAccount) {
    return this.nftService.findOne(id, currentAccount);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createNftDto: CreateNftDto, @CurrentAccount() currentAccount: CurrentSessionAccount) {
    return this.nftService.create(createNftDto, currentAccount);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(SignatureGuard)
  @Put(':id')
  update(
  @Param('id') id: number,
    @Body() updateNftDto: UpdateNftDto,
    @CurrentAccount() currentAccount: CurrentSessionAccount,
  ) {
    return this.nftService.update(id, updateNftDto, currentAccount);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/put-on-sale')
  putOnSale(
  @Param('id') id: number,
    @Body() putOnSaleDto: PutOnSaleDto,
    @CurrentAccount() currentAccount: CurrentSessionAccount,
  ) {
    return this.nftService.putOnSale(id, putOnSaleDto, currentAccount);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(SignatureGuard)
  @Put(':id/remove-from-sale')
  removeFromSale(
  @Param('id') id: number,
    @Body() updateNftDto: UpdateNftDto,
    @CurrentAccount() currentAccount: CurrentSessionAccount,
  ) {
    return this.nftService.removeFromSale(id, currentAccount);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(SignatureGuard)
  @Put(':id/cancel-sale')
  cancelSale(
  @Param('id') id: number,
    @Body() updateNftDto: UpdateNftDto,
    @CurrentAccount() currentAccount: CurrentSessionAccount,
  ) {
    return this.nftService.cancelSale(id, currentAccount);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(SignatureGuard)
  @Put(':id/transfer-nft')
  transfer(
  @Param('id') id: number,
    @Body() updateNftDto: UpdateNftDto,
    @CurrentAccount() currentAccount: CurrentSessionAccount,
  ) {
    return this.nftService.transfer(id, updateNftDto, currentAccount);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(SignatureGuard)
  @Put(':id/accept-offer')
  acceptOfferAndTransfer(
  @Param('id') id: number,
    @Body() updateNftDto: AcceptOfferDto,
    @CurrentAccount() currentAccount: CurrentSessionAccount,
  ) {
    return this.nftService.acceptOfferAndTransfer(id, updateNftDto, currentAccount);
  }

  @Get('/:id/bids')
  getBids(@Param('id') id: number, @Query() getListDto: GetListBidDto) {
    return this.nftService.getBids(id, getListDto);
  }

  @Get('/:id/count-bids')
  @ApiOkResponse({ type: CountBidResponseDto })
  countBids(@Param('id') id: number) {
    return this.nftService.countBids(id);
  }

  @Get('/:id/highest-bid')
  getHighestAndFirst(@Param('id') id: string) {
    return this.nftService.getHighestAndFirst(id);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(SignatureGuard)
  @Put('/:id/place-bid')
  placeBid(@Param('id') id: number, @Body() placeBidDto: PlaceBidDto, @CurrentAccount() currentAccount: CurrentSessionAccount) {
    return this.nftService.placeBid(id, placeBidDto, currentAccount);
  }

  @Post('finish-auctions')
  finishAuctions(@Req() req: any) {
    return this.nftService.finishAuctions(req?.headers['x-access-token'], req?.headers['x-private-key']);
  }

  // Referral
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ReferralLinkDto })
  @Get(':id/referral-link/:ref')
  findReferralLink(
  @Param('id') id: number,
    @Param('ref') ref: string,
  ) {
    return this.nftService.findReferralLink(id, ref);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ReferralLinkDto })
  @Post(':id/referral-link')
  generateReferralLink(
  @Param('id') id: number,
    @CurrentAccount() currentAccount: CurrentSessionAccount,
  ) {
    return this.nftService.generateReferralLink(id, currentAccount);
  }


  // @Patch(':id/mint')
  // mint(@Param('id') id: number) {
  //   return this.nftService.update(id, { is_minted: true });
  // }
  //
  // @Put(':id/sale')
  // sale(@Param('id') id: number) {
  //   return this.nftService.update(id, { on_sale: true });
  // }

  // @UseGuards(AuthGuard)
  // @Delete(':id')
  // delete(@Param('id') id: number) {
  //   // TODO: add check owner
  //   return this.nftService.delete(id);
  // }
}
