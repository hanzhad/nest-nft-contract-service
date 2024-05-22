import { BelongsTo, HasMany, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { CategorySchema } from '../../categories/schemas/category.schema';
import { ChainSchema } from '../../chains/schemas/chain.schema';
import { AccountSchema } from '../../accounts/schemas/account.schema';
import { CollectionSchema } from '../../collections/schemas/collection.schema';
import { AttributeType } from '../../../common/blockchain/core/types';
import { NftPropertySchema } from './nft-property.schema';

@Table({
  tableName: 'Nfts',
  indexes: [
    {
      unique: true,
      fields: ['contractAddress', 'token_id'],
    },
  ],
  scopes: {
    withoutUnLockable: {
      attributes: { exclude: ['unlockable'] },
    },
    publicList: {
      attributes: { exclude: ['unlockable', 'signature', 'nonce'] },
    },
  },
})
export class NftSchema extends Model {
  @Column
  name: string;

  @Column(DataType.INTEGER)
  network: number;

  @Column(DataType.JSONB)
  tags: string;

  @Column(DataType.TEXT)
  description: string;

  @Column(DataType.INTEGER)
  rate: number;

  @Column
  image: string;

  @Column
  on_sale: boolean;

  @Column(DataType.INTEGER)
  quantity: number;

  // @Required()
  // @Column({type: DataType.ENUM, defaultValue: NftTypeEnum.fixed})
  // type: NftTypeEnum;
  @Column
  type: string;

  @Column(DataType.DOUBLE)
  bid: number;

  // @Required()
  // @Column({type: DataType.ENUM, defaultValue: CurrencyEnum.SWAPP})
  // currency: CurrencyEnum;
  @Column
  currency: string;

  @Column
  timed: boolean;

  @Column(DataType.DOUBLE)
  price: number;

  @Column
  unlockable: string;

  @Column
  sensitive: boolean;

  @Column
  contractAddress: string;

  @Column(DataType.JSONB)
  jsonData: AttributeType;

  // @Column(DataType.JSONB)
  // properties: string;

  // @Column(DataType.JSONB)
  // stats: string;

  @Column
  url: string;

  // @Column({type: DataType.ENUM, defaultValue: NftModeEnum.single})
  // mode: NftModeEnum;
  @Column
  mode: string;

  @Column
  token_id: number;

  @Column(DataType.DOUBLE)
  highest_bid: number;

  @Column(DataType.JSONB)
  users: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  total_likes: number;

  @Column
  custom_url: string;

  @Column(DataType.BIGINT)
  start_date: number;

  @Column(DataType.BIGINT)
  endDate: number;

  @Column(DataType.INTEGER)
  end_date: number; // TODO: remove, after moved logic (frontend) to endDate

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isPrivateContent: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  hot: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_minted: boolean;

  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0,
  })
  brokerFee: number;

  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0,
  })
  royalty: number;

  @Column
  signature: string;

  @Column({ type: DataType.BIGINT })
  nonce: string;

  @ForeignKey(() => CollectionSchema)
  @Column
  colectionId: number;

  @ForeignKey(() => AccountSchema)
  @Column
  accountId: number;

  @ForeignKey(() => CategorySchema)
  @Column
  categoryId: number;

  @ForeignKey(() => ChainSchema)
  @Column
  chainId: number;

  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @BelongsTo(() => CollectionSchema)
  colection: CollectionSchema;

  @BelongsTo(() => AccountSchema)
  account: AccountSchema;

  @BelongsTo(() => CategorySchema)
  category: CategorySchema;

  @BelongsTo(() => ChainSchema)
  chain: ChainSchema;

  @HasMany(() => NftPropertySchema)
  properties: NftPropertySchema[];
}

