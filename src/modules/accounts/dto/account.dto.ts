import { ApiProperty } from '@nestjs/swagger';
import { SocialDto } from './social.dto';

export class AccountDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  address: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  rate: string;

  @ApiProperty()
  bio: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ type: [SocialDto] })
  socials: SocialDto;

  @ApiProperty()
  twitter: string;

  @ApiProperty()
  portfolio_url: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  artist: string;

  @ApiProperty()
  agent: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  cover_image: string;

}
