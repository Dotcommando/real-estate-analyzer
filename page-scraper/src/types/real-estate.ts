import { AirConditioning, EnergyEfficiency, Furnishing, Parking, RealtyType } from '../constants';


export interface IRealEstate {
  url: string;
  title: string;
  description: string;
  publish_date: number;
  city: string;
  district?: string;
  price: number;
  currency: string;
  ad_id: string;
  'reference-number'?: string;
  'property-area': number;
  type: RealtyType;
  floor: string;
  parking: Parking;
  furnishing: Furnishing;
  included?: string[];
  'online-viewing'?: boolean;
  'air-conditioning': AirConditioning;
  'construction-year': number | 'Older';
  'energy-efficiency': EnergyEfficiency;
  bedrooms: number;
  bathrooms: number;
  'postal-code': string;
}
