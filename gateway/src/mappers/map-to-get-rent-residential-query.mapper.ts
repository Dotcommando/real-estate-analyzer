import {
  AirConditioning,
  ARRAY_FIELDS,
  Categories,
  Condition,
  EnergyEfficiency,
  Furnishing,
  OnlineViewing,
  Parking,
  Pets,
  PoolType,
  RANGE_FIELDS,
  Source,
  StandardSet,
} from '../constants';
import { GetRentResidentialQueryDto } from '../generated/dto/get-residential-query.dto';
import { AG_MayBeArray, IGetRentResidentialQuery } from '../types';


const arrayFieldTypes: Record<string, any> = {
  'url': String,
  'ad_id': String,
  'online-viewing': OnlineViewing,
  'bedrooms': String,
  'bathrooms': String,
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

  const finalPart = parts[parts.length - 1];
  const rangeMatch = finalPart.match(/(.+)\[\$(lt|lte|gt|gte|eq)\]$/);

  if (rangeMatch) {
    const baseField = rangeMatch[1];
    const rangeKey = rangeMatch[2];

    if (!current[baseField]) {
      current[baseField] = {};
    }

    current[baseField][`$${rangeKey}`] = value;
  } else {
    current[finalPart] = value;
  }
}

export function mapToGetRentResidentialQueryMapper(dto: GetRentResidentialQueryDto): IGetRentResidentialQuery {
  const result: Partial<IGetRentResidentialQuery> = {};
  const dtoKeys = Object.keys(dto)
    .filter((key) => key !== 'type')
    .filter(key => !key.startsWith('s_'));

  for (const field of dtoKeys) {
    if (RANGE_FIELDS.some(rf => field.startsWith(`${rf}[$`))) {
      const baseField = field.split('[$')[0];

      if (!result[baseField]) {
        result[baseField] = {};
      }
      const rangeKey = field.split('[$')[1].slice(0, -1);

      result[baseField][rangeKey] = dto[field];
    } else if (ARRAY_FIELDS.includes(field)) {
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
