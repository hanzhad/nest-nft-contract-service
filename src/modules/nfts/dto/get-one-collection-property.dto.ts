import { ApiProperty } from '@nestjs/swagger';

export class GetOneCollectionPropertyDto {
  @ApiProperty()
  collectionId: number;

  @ApiProperty()
  key: string;
}
