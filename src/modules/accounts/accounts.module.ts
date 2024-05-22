import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AccountSchema } from './schemas/account.schema';
import { AccountsService } from './services/accounts.service';
import { AccountsRepository } from './repositories/accounts.repository';
import { AccountsController } from './accounts.controller';
import { AgentsModule } from '../agents/agents.module';
import { ArtistsModule } from '../artists/artists.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule, HttpModule, AgentsModule, ArtistsModule],
  providers: [
    {
      provide: AccountSchema.name,
      useValue: AccountSchema,
    },
    AccountsRepository,
    AccountsService,
  ],
  exports: [AccountsService],
  controllers: [AccountsController],
})
export class AccountsModule {
}
