import { IntersectionType } from '@nestjs/swagger';

import { GetRentResidentialSortDto } from './get-residential-sort.dto';
import { PaginationDto } from './pagination.dto';
import { TypeDto } from './type.dto';

import { GetRentResidentialQueryDto } from '../generated/dto/get-residential-query.dto';


export class SearchQueryDto extends IntersectionType(
  TypeDto,
  GetRentResidentialQueryDto,
  GetRentResidentialSortDto,
  PaginationDto,
) {
}
