import { AirConditioning, Furnishing, Pets } from '../../constants';
import { IRentProperty } from '../rent-property';


export interface IRentApartmentsFlats extends IRentProperty {
  'property-area': number;
  'property-area-unit': 'm²';
  type: string;
  'parking-places'?: number;
  furnishing?: Furnishing;
  'air-conditioning': AirConditioning;
  bedrooms: number;
  bathrooms: number;
  floor?: string;
  pets: Pets;
}
