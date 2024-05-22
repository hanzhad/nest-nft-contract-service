import { AttributeType } from 'common/blockchain/core/types';
import { NftTypeEnum } from '../enums/nft-type.enum';

export class CreateEventsNftDto {
  account: {
    address: string;
  };

  quantity: number;

  image: string;

  name: string;

  description: string;

  properties: any;

  stats: any;

  url: string;

  token_id: number;

  contractAddress: string;

  attributes: AttributeType[];

  jsonData: any;

  is_minted?: boolean;

  // TODO: rename to collection
  colectionId?: number;

  type: NftTypeEnum.fixed;
}
