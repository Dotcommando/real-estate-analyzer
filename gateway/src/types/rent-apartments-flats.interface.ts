import { IRentProperty } from './rent-property.interface';

import { AirConditioning, Furnishing, Parking, Pets } from '../constants';


export interface IRentApartmentsFlats extends IRentProperty {
  type: string;
  floor?: string;
  parking?: Parking;
  'property-area': number;
  'property-area-unit': 'm²';
  furnishing?: Furnishing;
  bedrooms: number;
  bathrooms: number;
  'air-conditioning': AirConditioning;
  pets: Pets;
}
