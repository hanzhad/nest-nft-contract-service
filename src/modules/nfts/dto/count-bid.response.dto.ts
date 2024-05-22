import { ApiProperty } from '@nestjs/swagger';

export class CountBidResponseDto {
  @ApiProperty()
  count: number;

  @ApiProperty()
  lastAddedAt: number;
}
