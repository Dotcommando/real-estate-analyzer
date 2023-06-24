import { AirConditioning, Furnishing, HousesType, Parking, Pets } from '../../constants';
import { IRentProperty } from '../rent-property';


export interface IRentHouses extends IRentProperty {
  'property-area': number;
  'property-area-unit': 'm²';
  type: HousesType;
  parking?: Parking;
  furnishing?: Furnishing;
  'air-conditioning': AirConditioning;
  bedrooms: number;
  bathrooms: number;
  pets: Pets;
  'plot-area': number;
  'plot-area-unit': 'm²';
}
