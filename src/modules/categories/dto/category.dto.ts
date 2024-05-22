import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
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

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
