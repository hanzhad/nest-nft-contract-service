import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { NftSchema } from 'modules/nfts/schemas/nft.schema';
import { NftPropertyDisplayType, NftPropertyType } from '../enums';

@Table({
  tableName: 'nft_properties',
  timestamps: false,
})
export class NftPropertySchema extends Model {
  @ForeignKey(() => NftSchema)
  nftId: number;

  @Column
  key: string;

  @Column(DataType.ENUM(...Object.values(NftPropertyType)))
  type: NftPropertyType;

  @Column
  value: string;

  @Column
  maxValue: number;

  @Column(DataType.ENUM(...Object.values(NftPropertyDisplayType)))
  displayType: NftPropertyDisplayType;

  @BelongsTo(() => NftSchema)
  nft: NftSchema;
}
