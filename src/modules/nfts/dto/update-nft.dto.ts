import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { CreateNftDto } from './create-nft.dto';

export class UpdateNftDto extends PartialType(CreateNftDto) {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  is_minted?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  on_sale?: boolean;

  @ApiProperty()
  @IsOptional()
  createdAt?: any;

  @ApiProperty()
  @IsOptional()
  updatedAt?: any;
}
