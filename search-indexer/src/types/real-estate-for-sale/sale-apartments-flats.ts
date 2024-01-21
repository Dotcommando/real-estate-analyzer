import { AirConditioning, Furnishing } from '../../constants';
import { ISaleProperty } from '../sale-property';


export interface ISaleApartmentsFlats extends ISaleProperty {
  'property-area': number;
  'property-area-unit': 'm²';
  type: string;
  'parking-places'?: number;
  furnishing?: Furnishing;
  'air-conditioning': AirConditioning;
  bedrooms: number;
  bathrooms: number;
  floor?: string;
}
