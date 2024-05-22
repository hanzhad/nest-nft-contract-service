import { PartialType } from '@nestjs/mapped-types';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetListCategoriesDto extends PartialType(PaginationQueryDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  slug?: string;
}
