import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateAgentDto {

  @ApiProperty({ required: true })
  @IsOptional()
  @IsBoolean()
  agency?: boolean;

  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  bio: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  slug: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  portfolio_url: string;

  @ApiProperty({ required: true })
  @IsString()
  twitter: string;

  @ApiProperty({ required: true })
  @IsString()
  signature: string;
}
