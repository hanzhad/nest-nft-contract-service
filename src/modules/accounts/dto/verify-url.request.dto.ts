import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyUrlRequestDto {
  @ApiProperty({ required: true })
  @IsString()
  url: string;
}
