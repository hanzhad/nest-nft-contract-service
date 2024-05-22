import { ApiProperty } from '@nestjs/swagger';

export class CreateCollectionPropertyDto {
  @ApiProperty()
  collectionId: number;

  @ApiProperty()
  key: string;

  @ApiProperty()
  values: string[];
}
