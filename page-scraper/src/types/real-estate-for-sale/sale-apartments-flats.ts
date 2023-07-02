import {
  AirConditioning,
  Furnishing,
  Parking,
} from '../../constants';
import { ISaleProperty } from '../sale-property';


export interface ISaleApartmentsFlats extends ISaleProperty {
  type: string;
  floor?: string;
  parking?: Parking;
  'property-area': number;
  'property-area-unit': 'm²';
  furnishing?: Furnishing;
  bedrooms: number;
  bathrooms: number;
  'air-conditioning': AirConditioning;
}
