import { AirConditioning, Furnishing, Parking } from '../../constants';
import { ISaleProperty } from '../sale-property';


export interface ISaleHouses extends ISaleProperty {
  'property-area': number;
  'property-area-unit': 'm²';
  type: string;
  parking?: Parking;
  furnishing?: Furnishing;
  'air-conditioning': AirConditioning;
  bedrooms: number;
  bathrooms?: number;
  toilets?: number;
}
