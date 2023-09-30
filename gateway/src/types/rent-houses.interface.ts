import { IRentProperty } from './rent-property.interface';

import { AirConditioning, Furnishing, Parking, Pets } from '../constants';


export interface IRentHouses extends IRentProperty {
  'property-area': number;
  'property-area-unit': 'm²';
  type: string;
  parking?: Parking;
  furnishing?: Furnishing;
  'air-conditioning': AirConditioning;
  bedrooms: number;
  bathrooms: number;
  pets: Pets;
  'plot-area': number;
  'plot-area-unit': 'm²';
}
