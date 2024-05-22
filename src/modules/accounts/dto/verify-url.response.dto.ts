import { ApiProperty } from '@nestjs/swagger';

export class VerifyUrlResponseDto {
  @ApiProperty()
  status: boolean;
}
