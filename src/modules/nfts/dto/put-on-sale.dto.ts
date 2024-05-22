import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { NftTypeEnum } from '../enums/nft-type.enum';

export class PutOnSaleDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  currency: string;

  @ApiProperty({ type: 'enum', enum: NftTypeEnum })
  @IsEnum(NftTypeEnum)
  type: string;

  @ApiProperty()
  @IsNumber()
  bid: number;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  start_date: number;

  @ApiProperty()
  @IsNumber()
  end_date: number;

  @ApiProperty()
  @IsString()
  signature: string;

  @ApiProperty()
  @IsNumber()
  nonce: number;
}
