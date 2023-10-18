import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsOptional, MaxLength, MinLength } from 'class-validator';

import { CITY_NAME_MAX_LENGTH, CITY_NAME_MIN_LENGTH, CountryEnum } from '../constants';
import { maxLengthStringMessage, minLengthStringMessage } from '../utils';


export class DistrictsDto {
  @ApiProperty({
    description: 'Two letters in lowercase',
    required: true,
    example: 'cy',
  })
  @IsEnum(CountryEnum)
  country: CountryEnum;

  @ApiProperty({
    description: 'City name, lowercase and mixed cases - both variants are acceptable',
    required: false,
    example: 'Limassol',
  })
  @IsOptional()
  @MinLength(CITY_NAME_MIN_LENGTH, {
    message: minLengthStringMessage('City name', CITY_NAME_MIN_LENGTH),
  })
  @MaxLength(CITY_NAME_MAX_LENGTH, {
    message: maxLengthStringMessage('City name', CITY_NAME_MAX_LENGTH),
  })
  city?: string;
}
