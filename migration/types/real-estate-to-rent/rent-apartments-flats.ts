import { AirConditioning, Furnishing, Parking, Pets, PoolType } from '../../constants';
import { IRentNonCommercialProperty } from '../rent-property';


export interface IRentApartmentsFlats extends IRentNonCommercialProperty {
  type: string;
  floor?: string;
  parking?: Parking;
  'parking-places'?: number;
  'property-area': number;
  'property-area-unit': 'm²';
  furnishing?: Furnishing;
  bedrooms: number;
  bathrooms?: number;
  toilets?: number;
  'pool-type'?: PoolType;
  'air-conditioning': AirConditioning;
  pets: Pets;
}