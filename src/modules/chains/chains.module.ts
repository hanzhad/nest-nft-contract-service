import { Module } from '@nestjs/common';
import { ChainsService } from './services/chains.service';
import { ChainsController } from './chains.controller';
import { ChainSchema } from './schemas/chain.schema';
import { ChainsRepository } from './repositories/chains.repository';
import { CurrencySchema } from './schemas/currency.schema';
import { SystemContractsSchema } from './schemas/system_contracts.schema';

@Module({
  providers: [
    {
      provide: ChainSchema.name,
      useValue: ChainSchema,
    },
    {
      provide: CurrencySchema.name,
      useValue: CurrencySchema,
    },
    {
      provide: SystemContractsSchema.name,
      useValue: SystemContractsSchema,
    },
    ChainsService,
    ChainsRepository,
  ],
  controllers: [ChainsController],
  exports: [ChainsService],
})
export class ChainsModule {
}
