import { ArrayMaxSize, IsArray, IsDateString, IsIn, IsNumber, IsOptional, IsString, IsUrl, Max, MaxLength, Min } from 'class-validator';

import { AirConditioning, AirConditioningArray, Categories, CategoriesArray, Condition, ConditionArray, EnergyEfficiency, EnergyEfficiencyArray, Furnishing, FurnishingArray, NoStatisticsDataReason, NoStatisticsDataReasonArray, OnlineViewing, OnlineViewingArray, Parking, ParkingArray, Pets, PetsArray, PoolType, PoolTypeArray, Source, SourceArray, StandardSet, StandardSetArray } from '../../constants';
import { MaybeArray } from '../../decorators/';
import { AG_MayBeArray, AG_MayBeRange } from '../../types';
import { getIntFromEnv } from '../../utils/';


export class StatFilterDto {
    @IsOptional()
    @IsNumber({}, { message: "'medianDelta[$lte]' must be a valid number" })
    'medianDelta[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'medianDelta[$lt]' must be a valid number" })
    'medianDelta[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'medianDelta[$eq]' must be a valid number" })
    'medianDelta[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'medianDelta[$gt]' must be a valid number" })
    'medianDelta[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'medianDelta[$gte]' must be a valid number" })
    'medianDelta[$gte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'meanDelta[$lte]' must be a valid number" })
    'meanDelta[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'meanDelta[$lt]' must be a valid number" })
    'meanDelta[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'meanDelta[$eq]' must be a valid number" })
    'meanDelta[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'meanDelta[$gt]' must be a valid number" })
    'meanDelta[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'meanDelta[$gte]' must be a valid number" })
    'meanDelta[$gte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'medianDeltaSqm[$lte]' must be a valid number" })
    'medianDeltaSqm[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'medianDeltaSqm[$lt]' must be a valid number" })
    'medianDeltaSqm[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'medianDeltaSqm[$eq]' must be a valid number" })
    'medianDeltaSqm[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'medianDeltaSqm[$gt]' must be a valid number" })
    'medianDeltaSqm[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'medianDeltaSqm[$gte]' must be a valid number" })
    'medianDeltaSqm[$gte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'meanDeltaSqm[$lte]' must be a valid number" })
    'meanDeltaSqm[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'meanDeltaSqm[$lt]' must be a valid number" })
    'meanDeltaSqm[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'meanDeltaSqm[$eq]' must be a valid number" })
    'meanDeltaSqm[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'meanDeltaSqm[$gt]' must be a valid number" })
    'meanDeltaSqm[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'meanDeltaSqm[$gte]' must be a valid number" })
    'meanDeltaSqm[$gte]'?: number;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field noDataAbsReason must contain an array' })
    @ArrayMaxSize(getIntFromEnv('NODATAABSREASON_ARRAY_MAX_SIZE', 5))
    @IsIn(NoStatisticsDataReasonArray, { each: true, message: 'Each noDataAbsReason must be a valid value' })
    noDataAbsReason?: NoStatisticsDataReason[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field noDataSqmReason must contain an array' })
    @ArrayMaxSize(getIntFromEnv('NODATASQMREASON_ARRAY_MAX_SIZE', 5))
    @IsIn(NoStatisticsDataReasonArray, { each: true, message: 'Each noDataSqmReason must be a valid value' })
    noDataSqmReason?: NoStatisticsDataReason[];
}

export class GetRentResidentialQueryDto {
    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field url must contain an array' })
    @ArrayMaxSize(getIntFromEnv('URL_ARRAY_MAX_SIZE', 5))
    @IsString({ each: true, message: 'Each url must be a string' })
    @MaxLength(getIntFromEnv('STRING_MAX_LENGTH', 128), { each: true, message: `Maximum length of each url is ${getIntFromEnv('STRING_MAX_LENGTH', 128)} characters` })
    url?: string[];

    @IsOptional()
    @IsDateString({}, { message: "'publish_date[$lte]' must be a valid date string" })
    'publish_date[$lte]'?: string;

    @IsOptional()
    @IsDateString({}, { message: "'publish_date[$lt]' must be a valid date string" })
    'publish_date[$lt]'?: string;

    @IsOptional()
    @IsDateString({}, { message: "'publish_date[$eq]' must be a valid date string" })
    'publish_date[$eq]'?: string;

    @IsOptional()
    @IsDateString({}, { message: "'publish_date[$gt]' must be a valid date string" })
    'publish_date[$gt]'?: string;

    @IsOptional()
    @IsDateString({}, { message: "'publish_date[$gte]' must be a valid date string" })
    'publish_date[$gte]'?: string;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field source must contain an array' })
    @ArrayMaxSize(getIntFromEnv('SOURCE_ARRAY_MAX_SIZE', 5))
    @IsIn(SourceArray, { each: true, message: 'Each source must be a valid value' })
    source?: Source[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field city must contain an array' })
    @ArrayMaxSize(getIntFromEnv('CITY_ARRAY_MAX_SIZE', 5))
    @IsString({ each: true, message: 'Each city must be a string' })
    @MaxLength(getIntFromEnv('STRING_MAX_LENGTH', 128), { each: true, message: `Maximum length of each city is ${getIntFromEnv('STRING_MAX_LENGTH', 128)} characters` })
    city?: string[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field district must contain an array' })
    @ArrayMaxSize(getIntFromEnv('DISTRICT_ARRAY_MAX_SIZE', 5))
    @IsString({ each: true, message: 'Each district must be a string' })
    @MaxLength(getIntFromEnv('STRING_MAX_LENGTH', 128), { each: true, message: `Maximum length of each district is ${getIntFromEnv('STRING_MAX_LENGTH', 128)} characters` })
    district?: string[];

    @IsOptional()
    @IsNumber({}, { message: "'price[$lte]' must be a valid number" })
    'price[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'price[$lt]' must be a valid number" })
    'price[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'price[$eq]' must be a valid number" })
    'price[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'price[$gt]' must be a valid number" })
    'price[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'price[$gte]' must be a valid number" })
    'price[$gte]'?: number;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field ad_id must contain an array' })
    @ArrayMaxSize(getIntFromEnv('AD_ID_ARRAY_MAX_SIZE', 5))
    @IsString({ each: true, message: 'Each ad_id must be a string' })
    @MaxLength(getIntFromEnv('STRING_MAX_LENGTH', 128), { each: true, message: `Maximum length of each ad_id is ${getIntFromEnv('STRING_MAX_LENGTH', 128)} characters` })
    ad_id?: string[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field online-viewing must contain an array' })
    @ArrayMaxSize(getIntFromEnv('ONLINE_VIEWING_ARRAY_MAX_SIZE', 5))
    @IsIn(OnlineViewingArray, { each: true, message: 'Each online-viewing must be a valid value' })
    'online-viewing'?: OnlineViewing[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field postal-code must contain an array' })
    @ArrayMaxSize(getIntFromEnv('POSTAL_CODE_ARRAY_MAX_SIZE', 5))
    @IsString({ each: true, message: 'Each postal-code must be a string' })
    @MaxLength(getIntFromEnv('STRING_MAX_LENGTH', 128), { each: true, message: `Maximum length of each postal-code is ${getIntFromEnv('STRING_MAX_LENGTH', 128)} characters` })
    'postal-code'?: string[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field condition must contain an array' })
    @ArrayMaxSize(getIntFromEnv('CONDITION_ARRAY_MAX_SIZE', 5))
    @IsIn(ConditionArray, { each: true, message: 'Each condition must be a valid value' })
    condition?: Condition[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field energy-efficiency must contain an array' })
    @ArrayMaxSize(getIntFromEnv('ENERGY_EFFICIENCY_ARRAY_MAX_SIZE', 5))
    @IsIn(EnergyEfficiencyArray, { each: true, message: 'Each energy-efficiency must be a valid value' })
    'energy-efficiency'?: EnergyEfficiency[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field construction-year must contain an array' })
    @ArrayMaxSize(getIntFromEnv('CONSTRUCTION_YEAR_ARRAY_MAX_SIZE', 5))
    @IsString({ each: true, message: 'Each construction-year must be a string' })
    @MaxLength(getIntFromEnv('STRING_MAX_LENGTH', 128), { each: true, message: `Maximum length of each construction-year is ${getIntFromEnv('STRING_MAX_LENGTH', 128)} characters` })
    'construction-year'?: string[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field floor must contain an array' })
    @ArrayMaxSize(getIntFromEnv('FLOOR_ARRAY_MAX_SIZE', 5))
    @IsString({ each: true, message: 'Each floor must be a string' })
    @MaxLength(getIntFromEnv('STRING_MAX_LENGTH', 128), { each: true, message: `Maximum length of each floor is ${getIntFromEnv('STRING_MAX_LENGTH', 128)} characters` })
    floor?: string[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field parking must contain an array' })
    @ArrayMaxSize(getIntFromEnv('PARKING_ARRAY_MAX_SIZE', 5))
    @IsIn(ParkingArray, { each: true, message: 'Each parking must be a valid value' })
    parking?: Parking[];

    @IsOptional()
    @IsNumber({}, { message: "'parking-places[$lte]' must be a valid number" })
    'parking-places[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'parking-places[$lt]' must be a valid number" })
    'parking-places[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'parking-places[$eq]' must be a valid number" })
    'parking-places[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'parking-places[$gt]' must be a valid number" })
    'parking-places[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'parking-places[$gte]' must be a valid number" })
    'parking-places[$gte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'property-area[$lte]' must be a valid number" })
    'property-area[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'property-area[$lt]' must be a valid number" })
    'property-area[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'property-area[$eq]' must be a valid number" })
    'property-area[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'property-area[$gt]' must be a valid number" })
    'property-area[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'property-area[$gte]' must be a valid number" })
    'property-area[$gte]'?: number;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field furnishing must contain an array' })
    @ArrayMaxSize(getIntFromEnv('FURNISHING_ARRAY_MAX_SIZE', 5))
    @IsIn(FurnishingArray, { each: true, message: 'Each furnishing must be a valid value' })
    furnishing?: Furnishing[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field bedrooms must contain an array' })
    @ArrayMaxSize(getIntFromEnv('BEDROOMS_ARRAY_MAX_SIZE', 5))
    @IsString({ each: true, message: 'Each bedrooms must be a string' })
    @MaxLength(getIntFromEnv('STRING_MAX_LENGTH', 128), { each: true, message: `Maximum length of each bedrooms is ${getIntFromEnv('STRING_MAX_LENGTH', 128)} characters` })
    bedrooms?: string[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field bathrooms must contain an array' })
    @ArrayMaxSize(getIntFromEnv('BATHROOMS_ARRAY_MAX_SIZE', 5))
    @IsString({ each: true, message: 'Each bathrooms must be a string' })
    @MaxLength(getIntFromEnv('STRING_MAX_LENGTH', 128), { each: true, message: `Maximum length of each bathrooms is ${getIntFromEnv('STRING_MAX_LENGTH', 128)} characters` })
    bathrooms?: string[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field air-conditioning must contain an array' })
    @ArrayMaxSize(getIntFromEnv('AIR_CONDITIONING_ARRAY_MAX_SIZE', 5))
    @IsIn(AirConditioningArray, { each: true, message: 'Each air-conditioning must be a valid value' })
    'air-conditioning'?: AirConditioning[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field pets must contain an array' })
    @ArrayMaxSize(getIntFromEnv('PETS_ARRAY_MAX_SIZE', 5))
    @IsIn(PetsArray, { each: true, message: 'Each pets must be a valid value' })
    pets?: Pets[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field alarm must contain an array' })
    @ArrayMaxSize(getIntFromEnv('ALARM_ARRAY_MAX_SIZE', 5))
    @IsIn(StandardSetArray, { each: true, message: 'Each alarm must be a valid value' })
    alarm?: StandardSet[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field attic must contain an array' })
    @ArrayMaxSize(getIntFromEnv('ATTIC_ARRAY_MAX_SIZE', 5))
    @IsIn(StandardSetArray, { each: true, message: 'Each attic must be a valid value' })
    attic?: StandardSet[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field balcony must contain an array' })
    @ArrayMaxSize(getIntFromEnv('BALCONY_ARRAY_MAX_SIZE', 5))
    @IsIn(StandardSetArray, { each: true, message: 'Each balcony must be a valid value' })
    balcony?: StandardSet[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field elevator must contain an array' })
    @ArrayMaxSize(getIntFromEnv('ELEVATOR_ARRAY_MAX_SIZE', 5))
    @IsIn(StandardSetArray, { each: true, message: 'Each elevator must be a valid value' })
    elevator?: StandardSet[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field fireplace must contain an array' })
    @ArrayMaxSize(getIntFromEnv('FIREPLACE_ARRAY_MAX_SIZE', 5))
    @IsIn(StandardSetArray, { each: true, message: 'Each fireplace must be a valid value' })
    fireplace?: StandardSet[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field garden must contain an array' })
    @ArrayMaxSize(getIntFromEnv('GARDEN_ARRAY_MAX_SIZE', 5))
    @IsIn(StandardSetArray, { each: true, message: 'Each garden must be a valid value' })
    garden?: StandardSet[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field playroom must contain an array' })
    @ArrayMaxSize(getIntFromEnv('PLAYROOM_ARRAY_MAX_SIZE', 5))
    @IsIn(StandardSetArray, { each: true, message: 'Each playroom must be a valid value' })
    playroom?: StandardSet[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field pool must contain an array' })
    @ArrayMaxSize(getIntFromEnv('POOL_ARRAY_MAX_SIZE', 5))
    @IsIn(PoolTypeArray, { each: true, message: 'Each pool must be a valid value' })
    pool?: PoolType[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field storage must contain an array' })
    @ArrayMaxSize(getIntFromEnv('STORAGE_ARRAY_MAX_SIZE', 5))
    @IsIn(StandardSetArray, { each: true, message: 'Each storage must be a valid value' })
    storage?: StandardSet[];

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
    @IsDateString({}, { message: "'updated_at[$lte]' must be a valid date string" })
    'updated_at[$lte]'?: string;

    @IsOptional()
    @IsDateString({}, { message: "'updated_at[$lt]' must be a valid date string" })
    'updated_at[$lt]'?: string;

    @IsOptional()
    @IsDateString({}, { message: "'updated_at[$eq]' must be a valid date string" })
    'updated_at[$eq]'?: string;

    @IsOptional()
    @IsDateString({}, { message: "'updated_at[$gt]' must be a valid date string" })
    'updated_at[$gt]'?: string;

    @IsOptional()
    @IsDateString({}, { message: "'updated_at[$gte]' must be a valid date string" })
    'updated_at[$gte]'?: string;

    @IsOptional()
    @IsNumber({}, { message: "'plot-area[$lte]' must be a valid number" })
    'plot-area[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'plot-area[$lt]' must be a valid number" })
    'plot-area[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'plot-area[$eq]' must be a valid number" })
    'plot-area[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'plot-area[$gt]' must be a valid number" })
    'plot-area[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'plot-area[$gte]' must be a valid number" })
    'plot-area[$gte]'?: number;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field category must contain an array' })
    @ArrayMaxSize(getIntFromEnv('CATEGORY_ARRAY_MAX_SIZE', 5))
    @IsIn(CategoriesArray, { each: true, message: 'Each category must be a valid value' })
    category?: Categories[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field subcategory must contain an array' })
    @ArrayMaxSize(getIntFromEnv('SUBCATEGORY_ARRAY_MAX_SIZE', 5))
    @IsString({ each: true, message: 'Each subcategory must be a string' })
    @MaxLength(getIntFromEnv('STRING_MAX_LENGTH', 128), { each: true, message: `Maximum length of each subcategory is ${getIntFromEnv('STRING_MAX_LENGTH', 128)} characters` })
    subcategory?: string[];

    @IsOptional()
    @IsNumber({}, { message: "'activeDays[$lte]' must be a valid number" })
    'activeDays[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'activeDays[$lt]' must be a valid number" })
    'activeDays[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'activeDays[$eq]' must be a valid number" })
    'activeDays[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'activeDays[$gt]' must be a valid number" })
    'activeDays[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'activeDays[$gte]' must be a valid number" })
    'activeDays[$gte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'price-sqm[$lte]' must be a valid number" })
    'price-sqm[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'price-sqm[$lt]' must be a valid number" })
    'price-sqm[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'price-sqm[$eq]' must be a valid number" })
    'price-sqm[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'price-sqm[$gt]' must be a valid number" })
    'price-sqm[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'price-sqm[$gte]' must be a valid number" })
    'price-sqm[$gte]'?: number;
    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_total.medianDelta[$lte]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_total.medianDelta[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_total.medianDelta[$lt]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_total.medianDelta[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_total.medianDelta[$eq]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_total.medianDelta[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_total.medianDelta[$gt]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_total.medianDelta[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_total.medianDelta[$gte]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_total.medianDelta[$gte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_total.meanDelta[$lte]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_total.meanDelta[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_total.meanDelta[$lt]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_total.meanDelta[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_total.meanDelta[$eq]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_total.meanDelta[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_total.meanDelta[$gt]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_total.meanDelta[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_total.meanDelta[$gte]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_total.meanDelta[$gte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_total.medianDeltaSqm[$lte]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_total.medianDeltaSqm[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_total.medianDeltaSqm[$lt]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_total.medianDeltaSqm[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_total.medianDeltaSqm[$eq]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_total.medianDeltaSqm[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_total.medianDeltaSqm[$gt]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_total.medianDeltaSqm[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_total.medianDeltaSqm[$gte]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_total.medianDeltaSqm[$gte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_total.meanDeltaSqm[$lte]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_total.meanDeltaSqm[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_total.meanDeltaSqm[$lt]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_total.meanDeltaSqm[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_total.meanDeltaSqm[$eq]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_total.meanDeltaSqm[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_total.meanDeltaSqm[$gt]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_total.meanDeltaSqm[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_total.meanDeltaSqm[$gte]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_total.meanDeltaSqm[$gte]'?: number;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field priceDeviations.city_avg_mean.monthly_total.noDataAbsReason must contain an array' })
    @ArrayMaxSize(getIntFromEnv('PRICEDEVIATIONS.CITY_AVG_MEAN.MONTHLY_TOTAL.NODATAABSREASON_ARRAY_MAX_SIZE', 5))
    @IsIn(NoStatisticsDataReasonArray, { each: true, message: 'Each priceDeviations.city_avg_mean.monthly_total.noDataAbsReason must be a valid value' })
    'priceDeviations.city_avg_mean.monthly_total.noDataAbsReason'?: NoStatisticsDataReason[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field priceDeviations.city_avg_mean.monthly_total.noDataSqmReason must contain an array' })
    @ArrayMaxSize(getIntFromEnv('PRICEDEVIATIONS.CITY_AVG_MEAN.MONTHLY_TOTAL.NODATASQMREASON_ARRAY_MAX_SIZE', 5))
    @IsIn(NoStatisticsDataReasonArray, { each: true, message: 'Each priceDeviations.city_avg_mean.monthly_total.noDataSqmReason must be a valid value' })
    'priceDeviations.city_avg_mean.monthly_total.noDataSqmReason'?: NoStatisticsDataReason[];

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_intermediary.medianDelta[$lte]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_intermediary.medianDelta[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_intermediary.medianDelta[$lt]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_intermediary.medianDelta[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_intermediary.medianDelta[$eq]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_intermediary.medianDelta[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_intermediary.medianDelta[$gt]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_intermediary.medianDelta[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_intermediary.medianDelta[$gte]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_intermediary.medianDelta[$gte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_intermediary.meanDelta[$lte]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_intermediary.meanDelta[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_intermediary.meanDelta[$lt]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_intermediary.meanDelta[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_intermediary.meanDelta[$eq]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_intermediary.meanDelta[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_intermediary.meanDelta[$gt]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_intermediary.meanDelta[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_intermediary.meanDelta[$gte]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_intermediary.meanDelta[$gte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_intermediary.medianDeltaSqm[$lte]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_intermediary.medianDeltaSqm[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_intermediary.medianDeltaSqm[$lt]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_intermediary.medianDeltaSqm[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_intermediary.medianDeltaSqm[$eq]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_intermediary.medianDeltaSqm[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_intermediary.medianDeltaSqm[$gt]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_intermediary.medianDeltaSqm[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_intermediary.medianDeltaSqm[$gte]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_intermediary.medianDeltaSqm[$gte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_intermediary.meanDeltaSqm[$lte]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_intermediary.meanDeltaSqm[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_intermediary.meanDeltaSqm[$lt]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_intermediary.meanDeltaSqm[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_intermediary.meanDeltaSqm[$eq]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_intermediary.meanDeltaSqm[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_intermediary.meanDeltaSqm[$gt]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_intermediary.meanDeltaSqm[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.monthly_intermediary.meanDeltaSqm[$gte]' must be a valid number" })
    'priceDeviations.city_avg_mean.monthly_intermediary.meanDeltaSqm[$gte]'?: number;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field priceDeviations.city_avg_mean.monthly_intermediary.noDataAbsReason must contain an array' })
    @ArrayMaxSize(getIntFromEnv('PRICEDEVIATIONS.CITY_AVG_MEAN.MONTHLY_INTERMEDIARY.NODATAABSREASON_ARRAY_MAX_SIZE', 5))
    @IsIn(NoStatisticsDataReasonArray, { each: true, message: 'Each priceDeviations.city_avg_mean.monthly_intermediary.noDataAbsReason must be a valid value' })
    'priceDeviations.city_avg_mean.monthly_intermediary.noDataAbsReason'?: NoStatisticsDataReason[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field priceDeviations.city_avg_mean.monthly_intermediary.noDataSqmReason must contain an array' })
    @ArrayMaxSize(getIntFromEnv('PRICEDEVIATIONS.CITY_AVG_MEAN.MONTHLY_INTERMEDIARY.NODATASQMREASON_ARRAY_MAX_SIZE', 5))
    @IsIn(NoStatisticsDataReasonArray, { each: true, message: 'Each priceDeviations.city_avg_mean.monthly_intermediary.noDataSqmReason must be a valid value' })
    'priceDeviations.city_avg_mean.monthly_intermediary.noDataSqmReason'?: NoStatisticsDataReason[];

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.daily_total.medianDelta[$lte]' must be a valid number" })
    'priceDeviations.city_avg_mean.daily_total.medianDelta[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.daily_total.medianDelta[$lt]' must be a valid number" })
    'priceDeviations.city_avg_mean.daily_total.medianDelta[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.daily_total.medianDelta[$eq]' must be a valid number" })
    'priceDeviations.city_avg_mean.daily_total.medianDelta[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.daily_total.medianDelta[$gt]' must be a valid number" })
    'priceDeviations.city_avg_mean.daily_total.medianDelta[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.daily_total.medianDelta[$gte]' must be a valid number" })
    'priceDeviations.city_avg_mean.daily_total.medianDelta[$gte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.daily_total.meanDelta[$lte]' must be a valid number" })
    'priceDeviations.city_avg_mean.daily_total.meanDelta[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.daily_total.meanDelta[$lt]' must be a valid number" })
    'priceDeviations.city_avg_mean.daily_total.meanDelta[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.daily_total.meanDelta[$eq]' must be a valid number" })
    'priceDeviations.city_avg_mean.daily_total.meanDelta[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.daily_total.meanDelta[$gt]' must be a valid number" })
    'priceDeviations.city_avg_mean.daily_total.meanDelta[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.daily_total.meanDelta[$gte]' must be a valid number" })
    'priceDeviations.city_avg_mean.daily_total.meanDelta[$gte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.daily_total.medianDeltaSqm[$lte]' must be a valid number" })
    'priceDeviations.city_avg_mean.daily_total.medianDeltaSqm[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.daily_total.medianDeltaSqm[$lt]' must be a valid number" })
    'priceDeviations.city_avg_mean.daily_total.medianDeltaSqm[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.daily_total.medianDeltaSqm[$eq]' must be a valid number" })
    'priceDeviations.city_avg_mean.daily_total.medianDeltaSqm[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.daily_total.medianDeltaSqm[$gt]' must be a valid number" })
    'priceDeviations.city_avg_mean.daily_total.medianDeltaSqm[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.daily_total.medianDeltaSqm[$gte]' must be a valid number" })
    'priceDeviations.city_avg_mean.daily_total.medianDeltaSqm[$gte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.daily_total.meanDeltaSqm[$lte]' must be a valid number" })
    'priceDeviations.city_avg_mean.daily_total.meanDeltaSqm[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.daily_total.meanDeltaSqm[$lt]' must be a valid number" })
    'priceDeviations.city_avg_mean.daily_total.meanDeltaSqm[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.daily_total.meanDeltaSqm[$eq]' must be a valid number" })
    'priceDeviations.city_avg_mean.daily_total.meanDeltaSqm[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.daily_total.meanDeltaSqm[$gt]' must be a valid number" })
    'priceDeviations.city_avg_mean.daily_total.meanDeltaSqm[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.city_avg_mean.daily_total.meanDeltaSqm[$gte]' must be a valid number" })
    'priceDeviations.city_avg_mean.daily_total.meanDeltaSqm[$gte]'?: number;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field priceDeviations.city_avg_mean.daily_total.noDataAbsReason must contain an array' })
    @ArrayMaxSize(getIntFromEnv('PRICEDEVIATIONS.CITY_AVG_MEAN.DAILY_TOTAL.NODATAABSREASON_ARRAY_MAX_SIZE', 5))
    @IsIn(NoStatisticsDataReasonArray, { each: true, message: 'Each priceDeviations.city_avg_mean.daily_total.noDataAbsReason must be a valid value' })
    'priceDeviations.city_avg_mean.daily_total.noDataAbsReason'?: NoStatisticsDataReason[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field priceDeviations.city_avg_mean.daily_total.noDataSqmReason must contain an array' })
    @ArrayMaxSize(getIntFromEnv('PRICEDEVIATIONS.CITY_AVG_MEAN.DAILY_TOTAL.NODATASQMREASON_ARRAY_MAX_SIZE', 5))
    @IsIn(NoStatisticsDataReasonArray, { each: true, message: 'Each priceDeviations.city_avg_mean.daily_total.noDataSqmReason must be a valid value' })
    'priceDeviations.city_avg_mean.daily_total.noDataSqmReason'?: NoStatisticsDataReason[];

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_total.medianDelta[$lte]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_total.medianDelta[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_total.medianDelta[$lt]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_total.medianDelta[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_total.medianDelta[$eq]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_total.medianDelta[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_total.medianDelta[$gt]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_total.medianDelta[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_total.medianDelta[$gte]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_total.medianDelta[$gte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_total.meanDelta[$lte]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_total.meanDelta[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_total.meanDelta[$lt]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_total.meanDelta[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_total.meanDelta[$eq]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_total.meanDelta[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_total.meanDelta[$gt]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_total.meanDelta[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_total.meanDelta[$gte]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_total.meanDelta[$gte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_total.medianDeltaSqm[$lte]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_total.medianDeltaSqm[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_total.medianDeltaSqm[$lt]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_total.medianDeltaSqm[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_total.medianDeltaSqm[$eq]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_total.medianDeltaSqm[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_total.medianDeltaSqm[$gt]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_total.medianDeltaSqm[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_total.medianDeltaSqm[$gte]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_total.medianDeltaSqm[$gte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_total.meanDeltaSqm[$lte]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_total.meanDeltaSqm[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_total.meanDeltaSqm[$lt]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_total.meanDeltaSqm[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_total.meanDeltaSqm[$eq]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_total.meanDeltaSqm[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_total.meanDeltaSqm[$gt]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_total.meanDeltaSqm[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_total.meanDeltaSqm[$gte]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_total.meanDeltaSqm[$gte]'?: number;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field priceDeviations.district_avg_mean.monthly_total.noDataAbsReason must contain an array' })
    @ArrayMaxSize(getIntFromEnv('PRICEDEVIATIONS.DISTRICT_AVG_MEAN.MONTHLY_TOTAL.NODATAABSREASON_ARRAY_MAX_SIZE', 5))
    @IsIn(NoStatisticsDataReasonArray, { each: true, message: 'Each priceDeviations.district_avg_mean.monthly_total.noDataAbsReason must be a valid value' })
    'priceDeviations.district_avg_mean.monthly_total.noDataAbsReason'?: NoStatisticsDataReason[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field priceDeviations.district_avg_mean.monthly_total.noDataSqmReason must contain an array' })
    @ArrayMaxSize(getIntFromEnv('PRICEDEVIATIONS.DISTRICT_AVG_MEAN.MONTHLY_TOTAL.NODATASQMREASON_ARRAY_MAX_SIZE', 5))
    @IsIn(NoStatisticsDataReasonArray, { each: true, message: 'Each priceDeviations.district_avg_mean.monthly_total.noDataSqmReason must be a valid value' })
    'priceDeviations.district_avg_mean.monthly_total.noDataSqmReason'?: NoStatisticsDataReason[];

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_intermediary.medianDelta[$lte]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_intermediary.medianDelta[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_intermediary.medianDelta[$lt]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_intermediary.medianDelta[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_intermediary.medianDelta[$eq]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_intermediary.medianDelta[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_intermediary.medianDelta[$gt]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_intermediary.medianDelta[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_intermediary.medianDelta[$gte]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_intermediary.medianDelta[$gte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_intermediary.meanDelta[$lte]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_intermediary.meanDelta[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_intermediary.meanDelta[$lt]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_intermediary.meanDelta[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_intermediary.meanDelta[$eq]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_intermediary.meanDelta[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_intermediary.meanDelta[$gt]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_intermediary.meanDelta[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_intermediary.meanDelta[$gte]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_intermediary.meanDelta[$gte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_intermediary.medianDeltaSqm[$lte]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_intermediary.medianDeltaSqm[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_intermediary.medianDeltaSqm[$lt]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_intermediary.medianDeltaSqm[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_intermediary.medianDeltaSqm[$eq]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_intermediary.medianDeltaSqm[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_intermediary.medianDeltaSqm[$gt]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_intermediary.medianDeltaSqm[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_intermediary.medianDeltaSqm[$gte]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_intermediary.medianDeltaSqm[$gte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_intermediary.meanDeltaSqm[$lte]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_intermediary.meanDeltaSqm[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_intermediary.meanDeltaSqm[$lt]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_intermediary.meanDeltaSqm[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_intermediary.meanDeltaSqm[$eq]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_intermediary.meanDeltaSqm[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_intermediary.meanDeltaSqm[$gt]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_intermediary.meanDeltaSqm[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.monthly_intermediary.meanDeltaSqm[$gte]' must be a valid number" })
    'priceDeviations.district_avg_mean.monthly_intermediary.meanDeltaSqm[$gte]'?: number;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field priceDeviations.district_avg_mean.monthly_intermediary.noDataAbsReason must contain an array' })
    @ArrayMaxSize(getIntFromEnv('PRICEDEVIATIONS.DISTRICT_AVG_MEAN.MONTHLY_INTERMEDIARY.NODATAABSREASON_ARRAY_MAX_SIZE', 5))
    @IsIn(NoStatisticsDataReasonArray, { each: true, message: 'Each priceDeviations.district_avg_mean.monthly_intermediary.noDataAbsReason must be a valid value' })
    'priceDeviations.district_avg_mean.monthly_intermediary.noDataAbsReason'?: NoStatisticsDataReason[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field priceDeviations.district_avg_mean.monthly_intermediary.noDataSqmReason must contain an array' })
    @ArrayMaxSize(getIntFromEnv('PRICEDEVIATIONS.DISTRICT_AVG_MEAN.MONTHLY_INTERMEDIARY.NODATASQMREASON_ARRAY_MAX_SIZE', 5))
    @IsIn(NoStatisticsDataReasonArray, { each: true, message: 'Each priceDeviations.district_avg_mean.monthly_intermediary.noDataSqmReason must be a valid value' })
    'priceDeviations.district_avg_mean.monthly_intermediary.noDataSqmReason'?: NoStatisticsDataReason[];

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.daily_total.medianDelta[$lte]' must be a valid number" })
    'priceDeviations.district_avg_mean.daily_total.medianDelta[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.daily_total.medianDelta[$lt]' must be a valid number" })
    'priceDeviations.district_avg_mean.daily_total.medianDelta[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.daily_total.medianDelta[$eq]' must be a valid number" })
    'priceDeviations.district_avg_mean.daily_total.medianDelta[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.daily_total.medianDelta[$gt]' must be a valid number" })
    'priceDeviations.district_avg_mean.daily_total.medianDelta[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.daily_total.medianDelta[$gte]' must be a valid number" })
    'priceDeviations.district_avg_mean.daily_total.medianDelta[$gte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.daily_total.meanDelta[$lte]' must be a valid number" })
    'priceDeviations.district_avg_mean.daily_total.meanDelta[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.daily_total.meanDelta[$lt]' must be a valid number" })
    'priceDeviations.district_avg_mean.daily_total.meanDelta[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.daily_total.meanDelta[$eq]' must be a valid number" })
    'priceDeviations.district_avg_mean.daily_total.meanDelta[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.daily_total.meanDelta[$gt]' must be a valid number" })
    'priceDeviations.district_avg_mean.daily_total.meanDelta[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.daily_total.meanDelta[$gte]' must be a valid number" })
    'priceDeviations.district_avg_mean.daily_total.meanDelta[$gte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.daily_total.medianDeltaSqm[$lte]' must be a valid number" })
    'priceDeviations.district_avg_mean.daily_total.medianDeltaSqm[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.daily_total.medianDeltaSqm[$lt]' must be a valid number" })
    'priceDeviations.district_avg_mean.daily_total.medianDeltaSqm[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.daily_total.medianDeltaSqm[$eq]' must be a valid number" })
    'priceDeviations.district_avg_mean.daily_total.medianDeltaSqm[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.daily_total.medianDeltaSqm[$gt]' must be a valid number" })
    'priceDeviations.district_avg_mean.daily_total.medianDeltaSqm[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.daily_total.medianDeltaSqm[$gte]' must be a valid number" })
    'priceDeviations.district_avg_mean.daily_total.medianDeltaSqm[$gte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.daily_total.meanDeltaSqm[$lte]' must be a valid number" })
    'priceDeviations.district_avg_mean.daily_total.meanDeltaSqm[$lte]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.daily_total.meanDeltaSqm[$lt]' must be a valid number" })
    'priceDeviations.district_avg_mean.daily_total.meanDeltaSqm[$lt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.daily_total.meanDeltaSqm[$eq]' must be a valid number" })
    'priceDeviations.district_avg_mean.daily_total.meanDeltaSqm[$eq]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.daily_total.meanDeltaSqm[$gt]' must be a valid number" })
    'priceDeviations.district_avg_mean.daily_total.meanDeltaSqm[$gt]'?: number;

    @IsOptional()
    @IsNumber({}, { message: "'priceDeviations.district_avg_mean.daily_total.meanDeltaSqm[$gte]' must be a valid number" })
    'priceDeviations.district_avg_mean.daily_total.meanDeltaSqm[$gte]'?: number;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field priceDeviations.district_avg_mean.daily_total.noDataAbsReason must contain an array' })
    @ArrayMaxSize(getIntFromEnv('PRICEDEVIATIONS.DISTRICT_AVG_MEAN.DAILY_TOTAL.NODATAABSREASON_ARRAY_MAX_SIZE', 5))
    @IsIn(NoStatisticsDataReasonArray, { each: true, message: 'Each priceDeviations.district_avg_mean.daily_total.noDataAbsReason must be a valid value' })
    'priceDeviations.district_avg_mean.daily_total.noDataAbsReason'?: NoStatisticsDataReason[];

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field priceDeviations.district_avg_mean.daily_total.noDataSqmReason must contain an array' })
    @ArrayMaxSize(getIntFromEnv('PRICEDEVIATIONS.DISTRICT_AVG_MEAN.DAILY_TOTAL.NODATASQMREASON_ARRAY_MAX_SIZE', 5))
    @IsIn(NoStatisticsDataReasonArray, { each: true, message: 'Each priceDeviations.district_avg_mean.daily_total.noDataSqmReason must be a valid value' })
    'priceDeviations.district_avg_mean.daily_total.noDataSqmReason'?: NoStatisticsDataReason[];
}

export class GetSaleResidentialQueryDto {
}
