import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'categories',
})
export class CategorySchema extends Model {
  @Column
  name: string;

  @Column(DataType.TEXT)
  description: string;

  @Column
  icon: string;

  @Column
  iconHover: string;

  @Column
  tag: string;

  @Column
  slug: string;

  @Column
  active: boolean;

  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Column({ type: DataType.DATE })
  updatedAt: Date;
}
