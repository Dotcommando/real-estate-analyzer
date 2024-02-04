import { ArrayMaxSize, IsArray, IsDateString, IsIn, IsNumber, IsOptional, IsString, IsUrl, Max, MaxLength, Min } from 'class-validator';

import { AirConditioning, Categories, Condition, EnergyEfficiency, Furnishing, NoStatisticsDataReason, OnlineViewing, Parking, Pets, PoolType, Source, StandardSet } from '../../constants';
import { MaybeArray } from '../../decorators/';
import { AG_MayBeArray, AG_MayBeRange } from '../../types';
import { getIntFromEnv } from '../../utils/';


export class StatFilterDto {
    @IsOptional()
    @MaybeArray()
    medianDelta?: AG_MayBeRange<number>;

    @IsOptional()
    @MaybeArray()
    meanDelta?: AG_MayBeRange<number>;

    @IsOptional()
    @MaybeArray()
    medianDeltaSqm?: AG_MayBeRange<number>;

    @IsOptional()
    @MaybeArray()
    meanDeltaSqm?: AG_MayBeRange<number>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field noDataAbsReason must contain an array' })
    @ArrayMaxSize(getIntFromEnv('NODATAABSREASON_ARRAY_MAX_SIZE', 5))
    @IsIn(NoDataAbsReasonArray, { each: true, message: 'Each noDataAbsReason must be a valid value' })
    noDataAbsReason?: AG_MayBeArray<NoStatisticsDataReason>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field noDataSqmReason must contain an array' })
    @ArrayMaxSize(getIntFromEnv('NODATASQMREASON_ARRAY_MAX_SIZE', 5))
    @IsIn(NoDataSqmReasonArray, { each: true, message: 'Each noDataSqmReason must be a valid value' })
    noDataSqmReason?: AG_MayBeArray<NoStatisticsDataReason>;
}

export class GetRentResidentialQueryDto {
    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field url must contain an array' })
    @ArrayMaxSize(getIntFromEnv('URL_ARRAY_MAX_SIZE', 5))
    @IsString({ each: true, message: 'Each url must be a string' })
    @MaxLength(getIntFromEnv('STRING_MAX_LENGTH', 64), { each: true, message: `Maximum length of each url is ${process.env.STRING_MAX_LENGTH} characters` })
    @IsUrl({}, { each: true, message: 'Each URL in url must be a valid URL' })
    url?: AG_MayBeArray<string>;

    @IsOptional()
    @MaybeArray()
    publish_date?: AG_MayBeRange<Date>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field source must contain an array' })
    @ArrayMaxSize(getIntFromEnv('SOURCE_ARRAY_MAX_SIZE', 5))
    @IsIn(SourceArray, { each: true, message: 'Each source must be a valid value' })
    source?: AG_MayBeArray<Source>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field city must contain an array' })
    @ArrayMaxSize(getIntFromEnv('CITY_ARRAY_MAX_SIZE', 5))
    @IsString({ each: true, message: 'Each city must be a string' })
    @MaxLength(getIntFromEnv('STRING_MAX_LENGTH', 64), { each: true, message: `Maximum length of each city is ${process.env.STRING_MAX_LENGTH} characters` })
    city?: AG_MayBeArray<string>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field district must contain an array' })
    @ArrayMaxSize(getIntFromEnv('DISTRICT_ARRAY_MAX_SIZE', 5))
    @IsString({ each: true, message: 'Each district must be a string' })
    @MaxLength(getIntFromEnv('STRING_MAX_LENGTH', 64), { each: true, message: `Maximum length of each district is ${process.env.STRING_MAX_LENGTH} characters` })
    district?: AG_MayBeArray<string>;

    @IsOptional()
    @MaybeArray()
    price?: AG_MayBeRange<number>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field ad_id must contain an array' })
    @ArrayMaxSize(getIntFromEnv('AD_ID_ARRAY_MAX_SIZE', 5))
    @IsString({ each: true, message: 'Each ad_id must be a string' })
    @MaxLength(getIntFromEnv('STRING_MAX_LENGTH', 64), { each: true, message: `Maximum length of each ad_id is ${process.env.STRING_MAX_LENGTH} characters` })
    ad_id?: AG_MayBeArray<string>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field online-viewing must contain an array' })
    @ArrayMaxSize(getIntFromEnv('ONLINE_VIEWING_ARRAY_MAX_SIZE', 5))
    @IsIn(OnlineViewingArray, { each: true, message: 'Each online-viewing must be a valid value' })
    'online-viewing'?: AG_MayBeArray<OnlineViewing>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field postal-code must contain an array' })
    @ArrayMaxSize(getIntFromEnv('POSTAL_CODE_ARRAY_MAX_SIZE', 5))
    @IsString({ each: true, message: 'Each postal-code must be a string' })
    @MaxLength(getIntFromEnv('STRING_MAX_LENGTH', 64), { each: true, message: `Maximum length of each postal-code is ${process.env.STRING_MAX_LENGTH} characters` })
    'postal-code'?: AG_MayBeArray<string>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field condition must contain an array' })
    @ArrayMaxSize(getIntFromEnv('CONDITION_ARRAY_MAX_SIZE', 5))
    @IsIn(ConditionArray, { each: true, message: 'Each condition must be a valid value' })
    condition?: AG_MayBeArray<Condition>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field energy-efficiency must contain an array' })
    @ArrayMaxSize(getIntFromEnv('ENERGY_EFFICIENCY_ARRAY_MAX_SIZE', 5))
    @IsIn(EnergyEfficiencyArray, { each: true, message: 'Each energy-efficiency must be a valid value' })
    'energy-efficiency'?: AG_MayBeArray<EnergyEfficiency>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field construction-year must contain an array' })
    @ArrayMaxSize(getIntFromEnv('CONSTRUCTION_YEAR_ARRAY_MAX_SIZE', 5))
    @IsString({ each: true, message: 'Each construction-year must be a string' })
    @MaxLength(getIntFromEnv('STRING_MAX_LENGTH', 64), { each: true, message: `Maximum length of each construction-year is ${process.env.STRING_MAX_LENGTH} characters` })
    'construction-year'?: AG_MayBeArray<string>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field floor must contain an array' })
    @ArrayMaxSize(getIntFromEnv('FLOOR_ARRAY_MAX_SIZE', 5))
    @IsString({ each: true, message: 'Each floor must be a string' })
    @MaxLength(getIntFromEnv('STRING_MAX_LENGTH', 64), { each: true, message: `Maximum length of each floor is ${process.env.STRING_MAX_LENGTH} characters` })
    floor?: AG_MayBeArray<string>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field parking must contain an array' })
    @ArrayMaxSize(getIntFromEnv('PARKING_ARRAY_MAX_SIZE', 5))
    @IsIn(ParkingArray, { each: true, message: 'Each parking must be a valid value' })
    parking?: AG_MayBeArray<Parking>;

    @IsOptional()
    @MaybeArray()
    'parking-places'?: AG_MayBeRange<number>;

    @IsOptional()
    @MaybeArray()
    'property-area'?: AG_MayBeRange<number>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field furnishing must contain an array' })
    @ArrayMaxSize(getIntFromEnv('FURNISHING_ARRAY_MAX_SIZE', 5))
    @IsIn(FurnishingArray, { each: true, message: 'Each furnishing must be a valid value' })
    furnishing?: AG_MayBeArray<Furnishing>;

    @IsOptional()
    @MaybeArray()
    bedrooms?: AG_MayBeRange<number>;

    @IsOptional()
    @MaybeArray()
    bathrooms?: AG_MayBeRange<number>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field air-conditioning must contain an array' })
    @ArrayMaxSize(getIntFromEnv('AIR_CONDITIONING_ARRAY_MAX_SIZE', 5))
    @IsIn(AirConditioningArray, { each: true, message: 'Each air-conditioning must be a valid value' })
    'air-conditioning'?: AG_MayBeArray<AirConditioning>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field pets must contain an array' })
    @ArrayMaxSize(getIntFromEnv('PETS_ARRAY_MAX_SIZE', 5))
    @IsIn(PetsArray, { each: true, message: 'Each pets must be a valid value' })
    pets?: AG_MayBeArray<Pets>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field alarm must contain an array' })
    @ArrayMaxSize(getIntFromEnv('ALARM_ARRAY_MAX_SIZE', 5))
    @IsIn(AlarmArray, { each: true, message: 'Each alarm must be a valid value' })
    alarm?: AG_MayBeArray<StandardSet>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field attic must contain an array' })
    @ArrayMaxSize(getIntFromEnv('ATTIC_ARRAY_MAX_SIZE', 5))
    @IsIn(AtticArray, { each: true, message: 'Each attic must be a valid value' })
    attic?: AG_MayBeArray<StandardSet>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field balcony must contain an array' })
    @ArrayMaxSize(getIntFromEnv('BALCONY_ARRAY_MAX_SIZE', 5))
    @IsIn(BalconyArray, { each: true, message: 'Each balcony must be a valid value' })
    balcony?: AG_MayBeArray<StandardSet>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field elevator must contain an array' })
    @ArrayMaxSize(getIntFromEnv('ELEVATOR_ARRAY_MAX_SIZE', 5))
    @IsIn(ElevatorArray, { each: true, message: 'Each elevator must be a valid value' })
    elevator?: AG_MayBeArray<StandardSet>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field fireplace must contain an array' })
    @ArrayMaxSize(getIntFromEnv('FIREPLACE_ARRAY_MAX_SIZE', 5))
    @IsIn(FireplaceArray, { each: true, message: 'Each fireplace must be a valid value' })
    fireplace?: AG_MayBeArray<StandardSet>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field garden must contain an array' })
    @ArrayMaxSize(getIntFromEnv('GARDEN_ARRAY_MAX_SIZE', 5))
    @IsIn(GardenArray, { each: true, message: 'Each garden must be a valid value' })
    garden?: AG_MayBeArray<StandardSet>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field playroom must contain an array' })
    @ArrayMaxSize(getIntFromEnv('PLAYROOM_ARRAY_MAX_SIZE', 5))
    @IsIn(PlayroomArray, { each: true, message: 'Each playroom must be a valid value' })
    playroom?: AG_MayBeArray<StandardSet>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field pool must contain an array' })
    @ArrayMaxSize(getIntFromEnv('POOL_ARRAY_MAX_SIZE', 5))
    @IsIn(PoolArray, { each: true, message: 'Each pool must be a valid value' })
    pool?: AG_MayBeArray<PoolType>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field storage must contain an array' })
    @ArrayMaxSize(getIntFromEnv('STORAGE_ARRAY_MAX_SIZE', 5))
    @IsIn(StorageArray, { each: true, message: 'Each storage must be a valid value' })
    storage?: AG_MayBeArray<StandardSet>;

    @IsOptional()
    @MaybeArray()
    'ad_last_updated'?: AG_MayBeRange<Date>;

    @IsOptional()
    @MaybeArray()
    'updated_at'?: AG_MayBeRange<Date>;

    @IsOptional()
    @MaybeArray()
    'plot-area'?: AG_MayBeRange<number>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field category must contain an array' })
    @ArrayMaxSize(getIntFromEnv('CATEGORY_ARRAY_MAX_SIZE', 5))
    @IsIn(CategoryArray, { each: true, message: 'Each category must be a valid value' })
    category?: AG_MayBeArray<Categories>;

    @IsOptional()
    @MaybeArray()
    @IsArray({ message: 'Field subcategory must contain an array' })
    @ArrayMaxSize(getIntFromEnv('SUBCATEGORY_ARRAY_MAX_SIZE', 5))
    @IsString({ each: true, message: 'Each subcategory must be a string' })
    @MaxLength(getIntFromEnv('STRING_MAX_LENGTH', 64), { each: true, message: `Maximum length of each subcategory is ${process.env.STRING_MAX_LENGTH} characters` })
    subcategory?: AG_MayBeArray<string>;

    @IsOptional()
    @MaybeArray()
    activeDays?: AG_MayBeRange<number>;

    @IsOptional()
    @MaybeArray()
    'price-sqm'?: AG_MayBeRange<number>;
}

export class GetSaleResidentialQueryDto {
}
