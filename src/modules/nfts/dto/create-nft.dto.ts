import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NftTypeEnum } from '../enums/nft-type.enum';
import { NftModeEnum } from '../enums/nft-mode.enum';

export class CreateNftDto {
  @ApiProperty()
  @IsNumber()
  account: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  accountId?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  chainId?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  colectionId?: number; // TODO: colectionId => collectionId after strapi


  @ApiProperty()
  @IsBoolean()
  sensitive: boolean;

  @ApiProperty()
  @IsString() // TODO
  currency: string;

  @ApiProperty()
  @ApiProperty({ type: 'enum', enum: NftTypeEnum })
  @IsEnum(NftTypeEnum)
  type: string;

  @ApiProperty()
  @ApiProperty({ type: 'enum', enum: NftModeEnum })
  @IsEnum(NftModeEnum)
  mode: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  category: number;

  @ApiProperty()
  @IsNumber()
  chain: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  end_date?: number;

  @ApiProperty()
  @IsNumber()
  colection: number;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  bid?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  start_date?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  endDate?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  custom_url?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  brokerFee?: number;

  @ApiProperty()
  @IsNumber()
  royalty: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  signature?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  nonce?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  network?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  rate?: number;

  @ApiProperty()
  @IsOptional()
  tags?: any;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  timed?: number;

  @ApiProperty()
  @IsOptional()
  properties?: any[];

  // TODO: remove
  @ApiProperty()
  @IsOptional()
  stats?: any;

  @ApiProperty()
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  token_id?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  highest_bid?: number;

  @ApiProperty()
  @IsOptional()
  users?: any;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  total_likes?: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isPrivateContent?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  hot?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  unlockable?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contractAddress?: string;

  @ApiProperty()
  @IsOptional()
  jsonData?: any;
}
