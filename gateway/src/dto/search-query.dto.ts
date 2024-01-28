import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsOptional, IsString, IsUrl, MaxLength, ValidateNested } from 'class-validator';
import { configDotenv } from 'dotenv';

import { DateRangeDto } from './date-range.dto';

import {
  AirConditioning,
  Categories,
  Condition,
  EnergyEfficiency,
  Furnishing,
  OnlineViewing,
  Parking,
  Pets,
  PoolType,
  Source,
  StandardSet,
} from '../constants';
import { MaybeArray } from '../decorators';
import { AG_MayBeArray, AG_MayBeRange } from '../types';
import { getIntFromEnv } from '../utils';


configDotenv();

export class SearchQueryDto {
  @IsOptional()
  @MaybeArray()
  @IsArray({ message: 'Field \'url\' must contain array of URLs' })
  @ArrayMaxSize(getIntFromEnv('URL_ARRAY_MAX_SIZE', 5))
  @IsString({ each: true, message: 'Each URL must be a string' })
  @IsUrl({}, { each: true, message: 'Each URL must be a valid URL' })
  @MaxLength(getIntFromEnv('STRING_MAX_LENGTH', 64), { each: true, message: `Maximum length of each URL is ${process.env.STRING_MAX_LENGTH} characters` })
  url?: AG_MayBeArray<string>;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  publish_date?: AG_MayBeRange<Date>;

  @IsOptional()
  @ArrayMaxSize(getIntFromEnv('SOURCE_ARRAY_MAX_SIZE', 5))
  source?: AG_MayBeArray<Source>;

  @IsOptional()
  city?: string[];

  district?: AG_MayBeArray<string>;
  price?: AG_MayBeRange<number>;
  ad_id?: AG_MayBeArray<string>;
  'online-viewing'?: AG_MayBeArray<OnlineViewing>;
  'postal-code'?: AG_MayBeArray<string>;
  condition?: AG_MayBeArray<Condition>;
  'energy-efficiency'?: AG_MayBeArray<EnergyEfficiency>;
  'construction-year'?: AG_MayBeArray<string>;
  floor?: AG_MayBeArray<string>;
  parking?: AG_MayBeArray<Parking>;
  'parking-places'?: AG_MayBeRange<number>;
  'property-area'?: AG_MayBeRange<number>;
  furnishing?: AG_MayBeArray<Furnishing>;
  bedrooms?: AG_MayBeRange<number>;
  bathrooms?: AG_MayBeRange<number>;
  'air-conditioning'?: AG_MayBeArray<AirConditioning>;
  pets?: AG_MayBeArray<Pets>;
  alarm?: AG_MayBeArray<StandardSet>;
  attic?: AG_MayBeArray<StandardSet>;
  balcony?: AG_MayBeArray<StandardSet>;
  elevator?: AG_MayBeArray<StandardSet>;
  fireplace?: AG_MayBeArray<StandardSet>;
  garden?: AG_MayBeArray<StandardSet>;
  playroom?: AG_MayBeArray<StandardSet>;
  pool?: AG_MayBeArray<PoolType>;
  storage?: AG_MayBeArray<StandardSet>;
  'ad_last_updated'?: AG_MayBeRange<Date>;
  'updated_at'?: AG_MayBeRange<Date>;
  'plot-area'?: AG_MayBeRange<number>;
  category?: AG_MayBeArray<Categories>;
  subcategory?: AG_MayBeArray<string>;
  activeDays?: AG_MayBeRange<number>;
  'price-sqm'?: AG_MayBeRange<number>;
}
