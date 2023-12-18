import { AirConditioning, Furnishing, Parking, PoolType } from '../../constants';
import { ISaleNonCommercialProperty } from '../sale-property';


export interface ISaleHouses extends ISaleNonCommercialProperty {
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
}
