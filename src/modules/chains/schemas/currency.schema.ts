import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Required } from 'common/decorators';
import { ChainSchema } from './chain.schema';

@Table({
  tableName: 'currencies',
})
export class CurrencySchema extends Model {
  @Required()
  @Column
  name: string;

  @Required()
  @Column
  address: string;

  @ForeignKey(() => ChainSchema)
  @Column
  chainId: number;

  @Required(true)
  @Column
  isActive: boolean;

  @BelongsTo(() => ChainSchema)
  chain: ChainSchema;
}
