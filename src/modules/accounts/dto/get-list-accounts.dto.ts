import { PartialType } from '@nestjs/mapped-types';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class GetListAccountsDto extends PartialType(PaginationQueryDto) {

}
