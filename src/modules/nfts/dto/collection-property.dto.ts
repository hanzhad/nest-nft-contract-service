import { ApiProperty } from '@nestjs/swagger';

export class CollectionPropertyDto {
  @ApiProperty()
  key: string;

  @ApiProperty()
  value: string;
}
