import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyTwitterRequestDto {
  @ApiProperty({ required: true })
  @IsString()
  url: string;

  @ApiProperty({ required: true })
  @IsString()
  token: string;

  // @ApiProperty({ required: true })
  // @IsString()
  // signature: string; // because the method changes the state of the account
}
