import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlaceBidDto {
  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  currency: string;

  @ApiProperty({ description: 'Referral slug' })
  @IsOptional()
  @IsString()
  referral?: string;

  @ApiProperty()
  @IsString()
  signature: string;

  @ApiProperty()
  @IsString()
  nonce: string;
}
