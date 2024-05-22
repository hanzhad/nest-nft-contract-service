import { ApiProperty } from '@nestjs/swagger';
import { NftTypeEnum } from '../enums/nft-type.enum';
import { NftModeEnum } from '../enums/nft-mode.enum';
import { AccountDto } from '../../accounts/dto/account.dto';

export class NftDto {
  @ApiProperty()
  id: number;
  
  @ApiProperty()
  account: AccountDto;

  @ApiProperty()
  accountId: number;

  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  chainId: number;

  @ApiProperty()
  colectionId: number; // TODO: colectionId => collectionId after strapi

  @ApiProperty()
  sensitive: boolean;

  @ApiProperty()
  currency: string;
  
  @ApiProperty({ type: 'enum', enum: NftTypeEnum })
  type: string;
  
  @ApiProperty({ type: 'enum', enum: NftModeEnum })
  mode: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  category: number;

  @ApiProperty()
  chain: number;

  @ApiProperty({ description: 'only auction' })
  end_date: number;

  @ApiProperty()
  colection: number;

  @ApiProperty()
  image: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ description: 'only auction' })
  bid: number;

  @ApiProperty({ description: 'only fixed price' })
  price: number;

  @ApiProperty({ description: 'only auction' })
  start_date: number;

  @ApiProperty({ description: 'only auction' })
  endDate: number;

  @ApiProperty()
  custom_url: string;

  @ApiProperty()
  brokerFee: number;

  @ApiProperty()
  royalty: number;

  @ApiProperty()
  network: number;

  @ApiProperty()
  rate: number;

  @ApiProperty()
  tags: any;

  @ApiProperty()
  timed: number;

  @ApiProperty()
  properties: any;

  @ApiProperty()
  stats: any;

  @ApiProperty()
  url: string;

  @ApiProperty()
  token_id: number;

  @ApiProperty()
  highest_bid: number;

  @ApiProperty()
  users: any;

  @ApiProperty()
  total_likes: number;

  @ApiProperty()
  isPrivateContent: boolean;

  @ApiProperty()
  hot: boolean;

  @ApiProperty()
  is_minted: boolean;

  @ApiProperty()
  on_sale: boolean;

  @ApiProperty()
  createdAt: any;

  @ApiProperty()
  updatedAt: any;
}
