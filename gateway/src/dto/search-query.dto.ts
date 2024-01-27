import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { configDotenv } from 'dotenv';

import { DateRangeDto } from './date-range.dto';
import { UrlItem } from './url.dto';

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
import { TransformToArray } from '../decorators';
import { AG_MayBeArray, AG_MayBeRange } from '../types';
import { getIntFromEnv } from '../utils';


configDotenv();

export class SearchQueryDto {
  @IsOptional()
  @TransformToArray()
  @IsArray({ message: 'Field \'url\' must contain array of URLs' })
  @ArrayMaxSize(getIntFromEnv('URL_ARRAY_MAX_SIZE', 5))
  @ValidateNested({ each: true })
  @Type(() => UrlItem)
  url?: AG_MayBeArray<string>;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  publish_date?: AG_MayBeRange<Date>;

  @IsOptional()
  @TransformToArray()
  source?: AG_MayBeArray<Source>;

  @IsOptional()
  @TransformToArray()
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
