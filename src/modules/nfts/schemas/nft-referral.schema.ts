import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { NftSchema } from './nft.schema';
import { AccountSchema } from '../../accounts/schemas/account.schema';

@Table({
  tableName: 'nft_referral',
  indexes: [
    {
      unique: true,
      fields: ['ref'],
    },
  ],
})
export class NftReferralSchema extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  ref: string;

  @ForeignKey(() => AccountSchema)
  accountId: number;

  @ForeignKey(() => NftSchema)
  nftId: number;

  @BelongsTo(() => AccountSchema)
  account: AccountSchema;

  @BelongsTo(() => NftSchema)
  nft: NftSchema;
}
