import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { FileTypeEnum } from '../../storage/enums/file-type.enum';

export class UploadFileDto {
  @ApiProperty({ type: 'enum', enum: FileTypeEnum })
  @IsEnum(FileTypeEnum)
  field: string;

  @ApiProperty()
  @IsString()
  signature: string;
}
