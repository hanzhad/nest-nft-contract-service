import { PartialType } from '@nestjs/mapped-types';
import { CreateCollectionPropertyDto } from './create-collection-property.dto';

export class UpdateNftPropertyDto extends PartialType(CreateCollectionPropertyDto) {

}
