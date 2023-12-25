import { AirConditioning, Furnishing, Pets } from '../../constants';
import { IRentProperty } from '../rent-property';


export interface IRentApartmentsFlats extends IRentProperty {
  type: string;
  floor?: string;
  'parking-places'?: number;
  'property-area': number;
  'property-area-unit': 'm²';
  furnishing?: Furnishing;
  bedrooms: number;
  bathrooms: number;
  'air-conditioning': AirConditioning;
  pets: Pets;
}
