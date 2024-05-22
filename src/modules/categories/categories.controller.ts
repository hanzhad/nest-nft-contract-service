import { Controller, Get, Param, Query } from '@nestjs/common';
import { CategoriesService } from './services/categories.service';
import { GetListCategoriesDto } from './dto/get-list-categories.dto';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CategoryDto } from './dto/category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {
  }

  @ApiQuery({ type: GetListCategoriesDto })
  @ApiOkResponse({ type: [CategoryDto] })
  @Get()
  async findAll(@Query() dto: GetListCategoriesDto) {
    return this.categoriesService.findAll(dto);
  }

  @ApiOkResponse({ type: CategoryDto })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.categoriesService.findOne(id);
  }
}
