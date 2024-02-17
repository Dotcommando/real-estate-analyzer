import { IntersectionType } from '@nestjs/swagger';

import { TypeDto } from './type.dto';

import { GetRentResidentialQueryDto } from '../generated/dto/get-residential-query.dto';


export class SearchQueryDto extends IntersectionType(TypeDto, GetRentResidentialQueryDto) {
}
