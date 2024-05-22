import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { CurrentPageEnum } from '../enums/current-page.enum';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { ApiProperty } from '@nestjs/swagger';
import { NftTypeEnum } from '../enums/nft-type.enum';

export class GetListNftDto extends PaginationQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name_contains: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  current_page?: CurrentPageEnum;

  @ApiProperty()
  @IsOptional()
  @IsString()
  type?: NftTypeEnum;

  @ApiProperty()
  @IsOptional()
  @IsString()
  currentAccountId?: number;

  currentAccountAddress: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  collection?: number | number[];

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  chain?: number | number[];

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  category?: number | number[];

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  priceMin?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  priceMax?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  status?: string | string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  account?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  on_sale?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  live?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  expired?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  highest_bid?: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  is_minted?: boolean;

  @ApiProperty()
  @IsOptional()
  property?: any;
}
