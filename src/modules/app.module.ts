import * as _ from 'lodash';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BullModule } from '@nestjs/bull';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import config from 'config';
import { CustomLogger } from '@opengeekslab_llc/nest-custom-logger';
import { NftsModule } from './nfts/nfts.module';
import { NftSchema } from './nfts/schemas/nft.schema';
import { CollectionSchema } from './collections/schemas/collection.schema';
import { ChainSchema } from './chains/schemas/chain.schema';
import { CategorySchema } from './categories/schemas/category.schema';
import { AccountSchema } from './accounts/schemas/account.schema';
import { AccountsModule } from './accounts/accounts.module';
import { CollectionsModule } from './collections/collections.module';
import { WebSocketModule } from '../common/modules/web-socket/web-socket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerTransport } from '../common/mailer/mailer.transport';
import { CollectionCollectorModule } from './collection-collector/collection-collector.module';
import { CollectionCollectorEventsSchema } from './collection-collector/schemas/collection-collector.events.schema';
import { CollectionCollectorCollectionsSchema } from './collection-collector/schemas/collection-collector.collections.schema';
import { NftPropertySchema } from './nfts/schemas/nft-property.schema';
import { NftReferralSchema } from './nfts/schemas/nft-referral.schema';
import { CurrencySchema } from './chains/schemas/currency.schema';
import { SystemContractsSchema } from './chains/schemas/system_contracts.schema';

const logger = CustomLogger('DbRequest');

@Module({
  imports: [
    SequelizeModule.forRoot({
      ...config.postgres,
      port: config.postgres.port ? _.toNumber(config.postgres.port) : undefined,
      dialect: 'postgres',
      logging: (message) => {
        logger.db(message);
      },
      autoLoadModels: true,
      synchronize: true,
      models: [
        AccountSchema,
        CategorySchema,
        ChainSchema,
        CollectionCollectorCollectionsSchema,
        CollectionCollectorEventsSchema,
        NftPropertySchema,
        CollectionSchema,
        NftSchema,
        NftReferralSchema,
        CurrencySchema,
        SystemContractsSchema,
      ],
    }),
    BullModule.forRoot({
      redis: {
        host: config.redis.connectionParams.host,
        password: config.redis.connectionParams.password,
        port: _.toNumber(config.redis.connectionParams.password) || undefined,
      },
      prefix: config.redis.prefix,
    }),
    MailerModule.forRoot({
      transport: mailerTransport(),
      defaults: {
        from: 'noreply@swapp.ee', // TODO: move to env
      },
      template: {
        dir: process.cwd() + '../templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    EventEmitterModule.forRoot(),
    AccountsModule,
    CollectionsModule,
    NftsModule,
    WebSocketModule,
    CollectionCollectorModule,
    MailerModule,
  ],
})
export class AppModule {
}
