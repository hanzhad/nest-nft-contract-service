import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { UpdateNftDto } from './update-nft.dto';

export class AcceptOfferDto extends PartialType(UpdateNftDto) {
  @ApiProperty()
  @IsNumber()
  offerId: number;
}
