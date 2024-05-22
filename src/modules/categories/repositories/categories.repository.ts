import { Inject, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { CategorySchema } from '../schemas/category.schema';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { WhereBuilder } from '../../../common/repository/where.builder';
import { GetListCategoriesDto } from '../dto/get-list-categories.dto';

@Injectable()
export class CategoriesRepository {
  constructor(@Inject(CategorySchema.name) private readonly categorySchema: typeof CategorySchema) {
  }

  async findAll(dto: GetListCategoriesDto): Promise<CategorySchema[]> {
    const limit = dto.limit || 10;
    const offset = dto.offset || 0;

    const whereBuilder = new WhereBuilder({ active: true });
    const where = whereBuilder.setSearch(dto.name, 'name')
      .setField(dto.slug, 'slug')
      .end();

    return this.categorySchema.findAll({
      where,
      limit,
      offset,
      order: [['name', 'ASC']],
    });
  }

  async findOne(id: number): Promise<CategorySchema> {
    return this.categorySchema.findByPk(id);
  }

  async create(dto: CreateCategoryDto): Promise<CategorySchema> {
    const { id } = await this.categorySchema.create(dto);
    return this.findOne(id);
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<CategorySchema> {
    await this.categorySchema.update(
      dto,
      {
        where: {
          id: _.toNumber(id),
        },
      });
    return this.findOne(id);
  }

  async delete(id: number): Promise<number> {
    return this.categorySchema.destroy({ where: { id } });
  }
}
