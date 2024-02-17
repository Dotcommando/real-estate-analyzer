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
import { GetRentResidentialQueryDto } from '../generated/dto/get-residential-query.dto';
import { AG_MayBeArray, IGetRentResidentialQuery } from '../types';


const rangeFields = [
  'publish_date',
  'price',
  'parking-places',
  'property-area',
  'bedrooms',
  'bathrooms',
  'ad_last_updated',
  'updated_at',
  'plot-area',
  'activeDays',
  'price-sqm',
];

const arrayFields = [
  'url',
  'ad_id',
  'online-viewing',
  'source',
  'city',
  'district',
  'postal-code',
  'condition',
  'energy-efficiency',
  'construction-year',
  'floor',
  'parking',
  'furnishing',
  'air-conditioning',
  'pets',
  'alarm',
  'attic',
  'balcony',
  'elevator',
  'fireplace',
  'garden',
  'playroom',
  'pool',
  'storage',
  'category',
  'subcategory',
];

const arrayFieldTypes: Record<string, any> = {
  'url': String,
  'ad_id': String,
  'online-viewing': OnlineViewing,
  'source': Source,
  'city': String,
  'district': String,
  'postal-code': String,
  'condition': Condition,
  'energy-efficiency': EnergyEfficiency,
  'construction-year': String,
  'floor': String,
  'parking': Parking,
  'furnishing': Furnishing,
  'air-conditioning': AirConditioning,
  'pets': Pets,
  'alarm': StandardSet,
  'attic': StandardSet,
  'balcony': StandardSet,
  'elevator': StandardSet,
  'fireplace': StandardSet,
  'garden': StandardSet,
  'playroom': StandardSet,
  'pool': PoolType,
  'storage': StandardSet,
  'category': Categories,
  'subcategory': String,
};

function processNestedPriceDeviations(field: string, value: any, result: any) {
  const parts = field.split('.');
  let current = result;

  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) {
      current[parts[i]] = {};
    }
    current = current[parts[i]];
  }

  const finalKey = parts[parts.length - 1];

  if (!current[finalKey]) {
    current[finalKey] = {};
  }

  const [ baseField, rangeModifier ] = finalKey.split('[$');
  const rangeKey = rangeModifier.slice(0, -1);

  if (!current[baseField]) {
    current[baseField] = {};
  }
  current[baseField][rangeKey] = value;
}

export function mapToGetRentResidentialQueryMapper(dto: GetRentResidentialQueryDto): IGetRentResidentialQuery {
  const result: Partial<IGetRentResidentialQuery> = {};

  for (const field of Object.keys(dto)) {
    if (rangeFields.some(rf => field.startsWith(`${rf}[$`))) {
      const baseField = field.split('[$')[0];

      if (!result[baseField]) {
        result[baseField] = {};
      }
      const rangeKey = field.split('[$')[1].slice(0, -1);

      result[baseField][rangeKey] = dto[field];
    } else if (arrayFields.includes(field)) {
      const fieldType = arrayFieldTypes[field];

      result[field] = dto[field] as AG_MayBeArray<typeof fieldType>;
    } else if (field.startsWith('priceDeviations.')) {
      processNestedPriceDeviations(field, dto[field], result);
    } else {
      result[field] = dto[field];
    }
  }

  return result as IGetRentResidentialQuery;
}
