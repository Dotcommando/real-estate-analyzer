import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { configDotenv } from 'dotenv';

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
import { AG_MayBeArray } from '../types';
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
  @IsDateString({}, { message: 'publish_date[$gte] must be a valid date string' })
  'publish_date[$gte]'?: string;

  @IsOptional()
  @IsDateString({}, { message: 'publish_date[$lte] must be a valid date string' })
  'publish_date[$lte]'?: string;

  @IsOptional()
  @IsDateString({}, { message: 'publish_date[$gt] must be a valid date string' })
  'publish_date[$gt]'?: string;

  @IsOptional()
  @IsDateString({}, { message: 'publish_date[$lt] must be a valid date string' })
  'publish_date[$lt]'?: string;

  @IsOptional()
  @IsDateString({}, { message: 'publish_date[$eq] must be a valid date string' })
  'publish_date[$eq]'?: string;


  @IsOptional()
  @ArrayMaxSize(getIntFromEnv('SOURCE_ARRAY_MAX_SIZE', 5))
  source?: AG_MayBeArray<Source>;

  @IsOptional()
  city?: string[];

  district?: AG_MayBeArray<string>;



  @IsOptional()
  @IsNumber({}, { message: 'price[$lte] must be a valid number' })
  @Min(1)
  @Max(100_000_000_000)
  'price[$lte]'?: number;

  @IsOptional()
  @IsNumber({}, { message: 'price[$lt] must be a valid number' })
  @Min(1)
  @Max(100_000_000_000)
  'price[$lt]'?: number;

  @IsOptional()
  @IsNumber({}, { message: 'price[$eq] must be a valid number' })
  @Min(1)
  @Max(100_000_000_000)
  'price[$eq]'?: number;

  @IsOptional()
  @IsNumber({}, { message: 'price[$gt] must be a valid number' })
  @Min(0)
  @Max(100_000_000_000)
  'price[$gt]'?: number;

  @IsOptional()
  @IsNumber({}, { message: 'price[$gte] must be a valid number' })
  @Min(0)
  @Max(100_000_000_000)
  'price[$gte]'?: number;


  ad_id?: AG_MayBeArray<string>;
  'online-viewing'?: AG_MayBeArray<OnlineViewing>;
  'postal-code'?: AG_MayBeArray<string>;
  condition?: AG_MayBeArray<Condition>;
  'energy-efficiency'?: AG_MayBeArray<EnergyEfficiency>;
  'construction-year'?: AG_MayBeArray<string>;
  floor?: AG_MayBeArray<string>;
  parking?: AG_MayBeArray<Parking>;


  @IsOptional()
  @IsNumber({}, { message: '\'parking-places[$lte]\' must be a valid number' })
  @Min(1)
  @Max(100)
  'parking-places[$lte]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'parking-places[$lt]\' must be a valid number' })
  @Min(1)
  @Max(100)
  'parking-places[$lt]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'parking-places[$eq]\' must be a valid number' })
  @Min(0)
  @Max(100)
  'parking-places[$eq]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'parking-places[$gt]\' must be a valid number' })
  @Min(0)
  @Min(100)
  'parking-places[$gt]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'parking-places[$gte]\' must be a valid number' })
  @Min(0)
  @Max(100)
  'parking-places[$gte]'?: number;


  @IsOptional()
  @IsNumber({}, { message: '\'property-area[$lte]\' must be a valid number' })
  @Min(1)
  @Max(10_000_000)
  'property-area[$lte]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'property-area[$lt]\' must be a valid number' })
  @Min(1)
  @Max(10_000_000)
  'property-area[$lt]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'property-area[$eq]\' must be a valid number' })
  @Min(0)
  @Max(10_000_000)
  'property-area[$eq]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'property-area[$gt]\' must be a valid number' })
  @Min(0)
  @Max(10_000_000)
  'property-area[$gt]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'property-area[$gte]\' must be a valid number' })
  @Min(0)
  @Max(10_000_000)
  'property-area[$gte]'?: number;


  furnishing?: AG_MayBeArray<Furnishing>;


  @IsOptional()
  @IsNumber({}, { message: '\'bedrooms[$lte]\' must be a valid number' })
  @Min(2)
  @Max(100)
  'bedrooms[$lte]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'bedrooms[$lt]\' must be a valid number' })
  @Min(2)
  @Max(100)
  'bedrooms[$lt]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'bedrooms[$eq]\' must be a valid number' })
  @Min(1)
  @Max(100)
  'bedrooms[$eq]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'bedrooms[$gt]\' must be a valid number' })
  @Min(1)
  @Max(100)
  'bedrooms[$gt]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'bedrooms[$gte]\' must be a valid number' })
  @Min(1)
  @Max(100)
  'bedrooms[$gte]'?: number;


  @IsOptional()
  @IsNumber({}, { message: '\'bathrooms[$lte]\' must be a valid number' })
  @Min(2)
  @Max(100)
  'bathrooms[$lte]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'bathrooms[$lt]\' must be a valid number' })
  @Min(2)
  @Max(100)
  'bathrooms[$lt]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'bathrooms[$eq]\' must be a valid number' })
  @Min(1)
  @Max(100)
  'bathrooms[$eq]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'bathrooms[$gt]\' must be a valid number' })
  @Min(1)
  @Max(100)
  'bathrooms[$gt]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'bathrooms[$gte]\' must be a valid number' })
  @Min(1)
  @Max(100)
  'bathrooms[$gte]'?: number;


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


  @IsOptional()
  @IsDateString({}, { message: "'ad_last_updated[$lte]' must be a valid date string" })
  'ad_last_updated[$lte]'?: string;

  @IsOptional()
  @IsDateString({}, { message: "'ad_last_updated[$lt]' must be a valid date string" })
  'ad_last_updated[$lt]'?: string;

  @IsOptional()
  @IsDateString({}, { message: "'ad_last_updated[$eq]' must be a valid date string" })
  'ad_last_updated[$eq]'?: string;

  @IsOptional()
  @IsDateString({}, { message: "'ad_last_updated[$gt]' must be a valid date string" })
  'ad_last_updated[$gt]'?: string;

  @IsOptional()
  @IsDateString({}, { message: "'ad_last_updated[$gte]' must be a valid date string" })
  'ad_last_updated[$gte]'?: string;


  @IsOptional()
  @IsDateString()
  'updated_at[$lte]'?: string;

  @IsOptional()
  @IsDateString()
  'updated_at[$lt]'?: string;

  @IsOptional()
  @IsDateString()
  'updated_at[$eq]'?: string;

  @IsOptional()
  @IsDateString()
  'updated_at[$gt]'?: string;

  @IsOptional()
  @IsDateString()
  'updated_at[$gte]'?: string;


  @IsOptional()
  @IsNumber({}, { message: '\'plot-area[$lte]\' must be a valid number' })
  @Min(1)
  @Max(10_000_000)
  'plot-area[lte]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'plot-area[$lt]\' must be a valid number' })
  @Min(1)
  @Max(10_000_000)
  'plot-area[lt]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'plot-area[$eq]\' must be a valid number' })
  @Min(0)
  @Max(10_000_000)
  'plot-area[eq]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'plot-area[$gt]\' must be a valid number' })
  @Min(0)
  @Max(10_000_000)
  'plot-area[gt]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'plot-area[$gte]\' must be a valid number' })
  @Min(0)
  @Max(10_000_000)
  'plot-area[gte]'?: number;


  category?: AG_MayBeArray<Categories>;
  subcategory?: AG_MayBeArray<string>;


  @IsOptional()
  @IsNumber({}, { message: '\'activeDays[$lte]\' must be a valid number' })
  @Min(1)
  @Max(365)
  'activeDays[$lte]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'activeDays[$lt]\' must be a valid number' })
  @Min(1)
  @Max(365)
  'activeDays[$lt]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'activeDays[$eq]\' must be a valid number' })
  @Min(0)
  @Max(365)
  'activeDays[$eq]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'activeDays[$gt]\' must be a valid number' })
  @Min(0)
  @Max(365)
  'activeDays[$gt]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'activeDays[$gte]\' must be a valid number' })
  @Min(0)
  @Max(365)
  'activeDays[$gte]'?: number;


  @IsOptional()
  @IsNumber({}, { message: '\'price-sqm[$lte]\' must be a valid number' })
  @Min(1)
  @Max(100_000)
  'price-sqm[$lte]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'price-sqm[$lt]\' must be a valid number' })
  @Min(1)
  @Max(100_000)
  'price-sqm[$lt]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'price-sqm[$eq]\' must be a valid number' })
  @Min(0)
  @Max(100_000)
  'price-sqm[$eq]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'price-sqm[$gt]\' must be a valid number' })
  @Min(0)
  @Max(100_000)
  'price-sqm[$gt]'?: number;

  @IsOptional()
  @IsNumber({}, { message: '\'price-sqm[$gte]\' must be a valid number' })
  @Min(0)
  @Max(100_000)
  'price-sqm[$gte]'?: number;
}
