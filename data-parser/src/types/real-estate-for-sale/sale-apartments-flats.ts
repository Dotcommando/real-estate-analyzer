import {
  AirConditioning,
  Furnishing,
  Parking,
  PoolType,
} from '../../constants';
import { ISaleProperty } from '../sale-property';


export interface ISaleApartmentsFlats extends ISaleProperty {
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
}
