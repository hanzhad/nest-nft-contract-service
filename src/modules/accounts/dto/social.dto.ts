import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SocialDto {
  @ApiProperty({ required: true })
  @IsString()
  title: string;

  @ApiProperty({ required: true })
  @IsString()
  url: string;
}
