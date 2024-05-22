import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateArtistDto {
  @ApiProperty({ required: true })
  @IsString()
  wallet: string;

  @ApiProperty({ required: true })
  @IsString()
  first_name: string;

  @ApiProperty({ required: true })
  @IsString()
  last_name: string;

  @ApiProperty({ required: true })
  @IsString()
  bio: string;

  @ApiProperty({ required: true })
  @IsString()
  art_type: string;

  @ApiProperty({ required: true })
  @IsString()
  email: string;

  @ApiProperty({ required: true })
  @IsString()
  portfolio_url: string;

  @ApiProperty({ required: true })
  @IsString()
  social_media: string;

  @ApiProperty({ required: true })
  @IsString()
  signature: string;
}
