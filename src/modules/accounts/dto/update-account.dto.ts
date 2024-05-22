import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { SocialDto } from './social.dto';

export class UpdateAccountDto {

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  background?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  rate?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ required: false, type: [SocialDto] })
  @IsArray()
  @IsOptional()
  socials?: SocialDto;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  twitter?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  portfolio_url?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  agent?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  artist?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  agentId?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  artistId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  signature?: string;
}
