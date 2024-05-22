import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { NftsService } from './services/nfts.service';
import { NftsController } from './nfts.controller';
import { NftSchema } from './schemas/nft.schema';
import { NftsRepository } from './repositories/nfts.repository';
import { BidsModule } from '../bids/bids.module';
import { AccountsModule } from '../accounts/accounts.module';
import { NFTMarketSolidContract } from 'common/blockchain/contracts/nft-market-solid/NFT-market-solid.contract';
import { RawHttpContract } from 'common/blockchain/core/contacts/raw-http-contract.service';
import { OffersModule } from '../offers/offers.module';
import { NftReferralSchema } from './schemas/nft-referral.schema';
import { NftReferralsRepository } from './repositories/nft-referrals.repository';
import { NftPropertySchema } from './schemas/nft-property.schema';
import { NftPropertiesRepository } from './repositories/nft-properties.repository';

@Module({
  imports: [
    BidsModule,
    OffersModule,
    AccountsModule,
  ],
  providers: [
    {
      provide: NftSchema.name,
      useValue: NftSchema,
    },
    {
      provide: NftReferralSchema.name,
      useValue: NftReferralSchema,
    },
    {
      provide: NftPropertySchema.name,
      useValue: NftPropertySchema,
    },
    {
      provide: RawHttpContract.name,
      useValue: RawHttpContract,
    },
    NftsService,
    NftsRepository,
    NftReferralsRepository,
    NftPropertiesRepository,
    NFTMarketSolidContract,
    // NftQueueService,
    // NftQueueProcessor,
  ],
  exports: [NftsService],
  controllers: [NftsController],
})
export class NftsModule implements OnApplicationBootstrap {
  // constructor(
  //   private readonly nftQueueService: NftQueueService,
  // ) {
  // }

  onApplicationBootstrap(): any {
    // this.nftQueueService.run();
  }

}
