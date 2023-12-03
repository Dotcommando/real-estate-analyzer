import { AirConditioning, Furnishing, Parking, Pets, PoolType } from '../../constants';
import { IRentProperty } from '../rent-property';


export interface IRentHouses extends IRentProperty {
  'property-area': number;
  'property-area-unit': 'm²';
  type: string;
  parking?: Parking;
  'parking-places'?: number;
  furnishing?: Furnishing;
  'air-conditioning': AirConditioning;
  bedrooms: number;
  bathrooms?: number;
  toilets?: number;
  'pool-type'?: PoolType;
  pets: Pets;
  'plot-area': number;
  'plot-area-unit': 'm²';
}
