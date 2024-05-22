import { ApiProperty } from '@nestjs/swagger';

export class CreateChainDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  icon: string;

  @ApiProperty()
  active: boolean;
}
