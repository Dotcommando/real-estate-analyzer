import { ISaleProperty } from './sale-property.interface';

import {
  AirConditioning,
  Furnishing,
  Parking,
} from '../constants';


export interface ISaleApartmentsFlats extends ISaleProperty {
  type: string;
  floor?: string;
  parking?: Parking;
  'property-area': number;
  'property-area-unit': 'm²';
  furnishing?: Furnishing;
  bedrooms: number;
  bathrooms: number;
  'air-conditioning': AirConditioning;
}
