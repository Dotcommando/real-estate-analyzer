import { IsDateString, IsOptional, Validate } from 'class-validator';

import { IsDateRangeValid } from '../decorators';


export class DateRangeDto {
  @IsOptional()
  @IsDateString({}, { message: '$gte must be a valid date string' })
  $gte?: string;

  @IsOptional()
  @IsDateString({}, { message: '$lte must be a valid date string' })
  $lte?: string;

  @IsOptional()
  @IsDateString({}, { message: '$gt must be a valid date string' })
  $gt?: string;

  @IsOptional()
  @IsDateString({}, { message: '$lt must be a valid date string' })
  $lt?: string;

  @Validate(IsDateRangeValid)
  dateRangeCorrectness?: boolean;
}
