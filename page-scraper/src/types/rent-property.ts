export interface IRentProperty {
  ad_id: string;
  url: string;
  description: string;
  publish_date: number;
  city: string;
  district?: string;
  price: number;
  currency: string;
  'property-area': number;
  pets: boolean;
  type: 'Apartment' | 'Penthouse';
  floor: string;
  parking: 'Covered' | 'Uncovered';
  furnishing: 'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished' | 'Appliances οnly';
  included?: string[];
  'postal-code': string;
  'online-viewing'?: boolean;
  'air-conditioning'?: 'Full, all rooms' | 'Partly' | 'No';
  'energy-efficiency'?: 'A' | 'B' | 'C' | 'N/A' | 'In Progress';
  bedrooms: number;
  bathrooms: number;
  'construction-year'?: number | 'Older';
  'reference-number': string;
}
