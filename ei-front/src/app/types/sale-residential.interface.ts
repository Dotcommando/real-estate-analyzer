import { IPriceDeviations } from './price-deviations.interface';
import { ISaleApartmentsFlats, ISaleHouses } from './real-estate-for-sale';

import { Categories } from '../constants';


export interface ISaleResidential extends Omit<ISaleApartmentsFlats, 'type' | 'version' | 'expired'>, Omit<ISaleHouses, 'type' | 'version' | 'expired'> {
  'price-sqm': number;
  category: Categories;
  subcategory: string;
  activeDays: number;
  priceDeviations: IPriceDeviations;
}

export interface ISaleResidentialId<T_id = string> extends ISaleResidential {
  _id: T_id;
}

export const keysOfISaleResidential: Array<keyof ISaleResidential> = [
  'url',
  'title',
  'description',
  'publish_date',
  'source',
  'city',
  'district',
  'price',
  'currency',
  'ad_id',
  'online-viewing',
  'postal-code',
  'reference-number',
  'registration-number',
  'registration-block',
  'condition',
  'energy-efficiency',
  'construction-year',
  'floor',
  'parking',
  'parking-places',
  'property-area',
  'property-area-unit',
  'furnishing',
  'bedrooms',
  'bathrooms',
  'air-conditioning',
  'alarm',
  'attic',
  'balcony',
  'elevator',
  'fireplace',
  'garden',
  'playroom',
  'pool',
  'storage',
  'coords',
  'ad_last_updated',
  'updated_at',
  'category',
  'subcategory',
  'activeDays',
  'price-sqm',
  'priceDeviations',
];

export const keysOfISaleResidentialId: Array<keyof ISaleResidentialId> = [
  '_id',
  ...keysOfISaleResidential,
];
