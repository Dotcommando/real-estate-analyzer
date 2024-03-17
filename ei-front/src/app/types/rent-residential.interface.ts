import { IPriceDeviations } from './price-deviations.interface';
import { IRentApartmentsFlats, IRentHouses } from './real-estate-to-rent';

import { Categories } from '../constants';


export interface IRentResidential extends Omit<IRentApartmentsFlats, 'type' | 'version' | 'expired'>, Omit<IRentHouses, 'type' | 'version' | 'expired'> {
  'price-sqm': number;
  category: Categories;
  subcategory: string;
  activeDays: number;
  priceDeviations: IPriceDeviations;
}

export interface IRentResidentialId<T_id = string> extends IRentResidential {
  _id: T_id;
}

export const keysOfIRentResidential: Array<keyof IRentResidential> = [
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
  'coords',
  'ad_last_updated',
  'updated_at',
  'plot-area',
  'plot-area-unit',
  'category',
  'subcategory',
  'activeDays',
  'price-sqm',
  'priceDeviations',
];

export const keysOfIRentResidentialId: Array<keyof IRentResidentialId> = [
  '_id',
  ...keysOfIRentResidential,
];
