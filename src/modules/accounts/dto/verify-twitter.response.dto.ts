import { ApiProperty } from '@nestjs/swagger';
import { AccountDto } from './account.dto';

export class VerifyTwitterResponseDto {
  @ApiProperty()
  verified: boolean;

  // @ApiProperty()
  // url: string;
  //
  // @ApiProperty()
  // token: string;
  //
  // @ApiProperty()
  // tweet: string;
  //
  // @ApiProperty()
  // message: string;

  @ApiProperty()
  username: string;

  @ApiProperty({ type: AccountDto })
  account: AccountDto;
}
