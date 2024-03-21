import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

import { PAGINATION_MAX_LIMIT } from '../constants';


export class PaginationDto {
  @Type(() => Number)
  @IsInt({ message: 'Offset must be an integer' })
  @Min(0, { message: 'Offset must be greater than or equal to 0' })
  readonly offset: number = 0;

  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be greater than 0' })
  @Max(PAGINATION_MAX_LIMIT, { message: `Limit must be less than ${PAGINATION_MAX_LIMIT}` })
  readonly limit: number = PAGINATION_MAX_LIMIT;
}
