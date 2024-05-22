import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { CurrencySchema } from './currency.schema';
import { SystemContractsSchema } from './system_contracts.schema';
import { Required } from 'common/decorators';
import { NftSchema } from '../../nfts/schemas/nft.schema';
import { CollectionCollectorCollectionsSchema } from '../../collection-collector/schemas/collection-collector.collections.schema';
import { CollectionCollectorEventsSchema } from '../../collection-collector/schemas/collection-collector.events.schema';
import { urlRegEx } from '../../../common/constants';

@Table({
  tableName: 'chains',
})
export class ChainSchema extends Model {
  @Column
  name: string;

  @Required()
  @Column({ unique: true })
  chainId: number;

  @Column
  icon: string;

  @Required()
  @Column({ validate: { is: urlRegEx } })
  httpProviderAddress: string;

  @Column
  active: boolean;

  @HasMany(() => CurrencySchema)
  currenciesList: CurrencySchema[];

  @HasMany(() => SystemContractsSchema)
  systemContractsList: SystemContractsSchema[];

  @HasMany(() => NftSchema)
  nftsList: NftSchema[];

  @HasMany(() => CollectionCollectorCollectionsSchema)
  collectionCollectorCollectionsList: CollectionCollectorCollectionsSchema[];

  @HasMany(() => CollectionCollectorEventsSchema)
  collectionCollectorEventsList: CollectionCollectorEventsSchema[];
}
