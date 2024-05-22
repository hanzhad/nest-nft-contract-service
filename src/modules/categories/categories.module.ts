import { Module } from '@nestjs/common';
import { CategoriesService } from './services/categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './repositories/categories.repository';
import { CategorySchema } from './schemas/category.schema';

@Module({
  providers: [
    {
      provide: CategorySchema.name,
      useValue: CategorySchema,
    },
    CategoriesService,
    CategoriesRepository,
  ],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {
}
