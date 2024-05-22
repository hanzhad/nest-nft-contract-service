import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({ required: true })
  @IsString()
  address: string;

  @ApiProperty({ required: true })
  @IsString()
  nonce: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
