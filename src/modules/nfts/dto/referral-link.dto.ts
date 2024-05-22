import { ApiProperty } from '@nestjs/swagger';
import { AccountSchema } from '../../accounts/schemas/account.schema';
import { NftSchema } from '../schemas/nft.schema';

export class ReferralLinkDto {
  @ApiProperty()
  ref: string;

  @ApiProperty()
  account: AccountSchema;

  @ApiProperty()
  nft: NftSchema;
}
