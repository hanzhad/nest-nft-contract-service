import { IsNumber, IsOptional } from 'class-validator';

export class GetListBidDto {
  @IsOptional()
  @IsNumber()
  auction_id?: number;
}
