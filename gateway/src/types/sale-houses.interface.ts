import { ISaleProperty } from './sale-property.interface.';

import { AirConditioning, Furnishing, Parking } from '../constants';


export interface ISaleHouses extends ISaleProperty {
  'property-area': number;
  'property-area-unit': 'm²';
  type: string;
  parking?: Parking;
  furnishing?: Furnishing;
  'air-conditioning': AirConditioning;
  bedrooms: number;
  bathrooms: number;
}
