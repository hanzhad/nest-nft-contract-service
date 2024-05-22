import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Required } from 'common/decorators';
import { ChainSchema } from './chain.schema';

@Table({
  tableName: 'system_contracts',
})
export class SystemContractsSchema extends Model {
  @Required()
  @Column
  name: string;

  @Required()
  @Column
  address: string;

  @ForeignKey(() => ChainSchema)
  @Column
  chainId: number;

  @BelongsTo(() => ChainSchema)
  chain: ChainSchema;
}
