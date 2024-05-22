import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../repositories/categories.repository';
import { GetListCategoriesDto } from '../dto/get-list-categories.dto';
import { CategorySchema } from '../schemas/category.schema';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {
  }

  async findAll(dto: GetListCategoriesDto): Promise<CategorySchema[]> {
    return this.categoriesRepository.findAll(dto);
  }

  async findOne(id: number): Promise<CategorySchema> {
    return this.categoriesRepository.findOne(id);
  }

  async create(dto: CreateCategoryDto): Promise<CategorySchema> {
    return this.categoriesRepository.create(dto);
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<CategorySchema> {
    return this.categoriesRepository.update(id, dto);
  }

  async delete(id: number): Promise<number> {
    return this.categoriesRepository.delete(id);
  }
}
