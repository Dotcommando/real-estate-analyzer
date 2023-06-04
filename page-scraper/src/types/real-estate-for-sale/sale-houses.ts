import { AirConditioning, Furnishing, HousesType, Parking } from '../../constants';
import { ISaleProperty } from '../sale-property';


export interface ISaleHouses extends ISaleProperty {
  'property-area': number;
  'property-area-unit': 'm²';
  type: HousesType;
  parking?: Parking;
  furnishing?: Furnishing;
  'air-conditioning': AirConditioning;
  bedrooms: number;
  bathrooms: number;
}
