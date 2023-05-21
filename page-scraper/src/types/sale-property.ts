export interface ISaleProperty {
  url: string;
  description: string;
  publish_date: number;
  city: string;
  district?: string;
  price: number;
  currency: string;
  ad_id: string;
  'reference-number'?: string;
  'property-area': number;
  type: 'Apartment' | 'Penthouse';
  floor: string;
  parking: 'Covered' | 'Uncovered';
  condition: 'Brand new' | 'Resale' | 'Under construction';
  furnishing: 'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished' | 'Appliances οnly';
  included?: string[];
  'online-viewing'?: boolean;
  'air-conditioning': 'Full, all rooms' | 'Partly' | 'No';
  'construction-year': number | 'Older';
  'energy-efficiency': 'A' | 'B' | 'C' | 'N/A' | 'In Progress';
  bedrooms: number;
  'square-meter-price': number;
  bathrooms: number;
  'registration-number'?: number;
  'postal-code': string;
  'registration-block'?: number;
}
