import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  icon: string;

  @ApiProperty()
  iconHover: string;

  @ApiProperty()
  tag: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  active: boolean;
}
