import {
  AirConditioning,
  Categories,
  EnergyEfficiency,
  Floor,
  Furnishing,
  Parking,
  Pets,
  PoolType,
  StandardSet,
} from '../../constants';
import { ICoords } from '../coords.interface';


export interface IRentResidentialContent<T_id = string> {
  _id: T_id;
  ad: T_id;
  title: string;
  description: string;
  publish_date: Date;
  address: string; // ABSENT in old version
  city: string;
  district: string | null;
  price: number;
  currency: string;
  // 'online-viewing': OnlineViewing; // DELETED
  'postal-code': number | null; // MAPPING needed
  // 'reference-number'?: string; // DELETED
  'registration-number': number | null;
  'registration-block': number | null;
  // condition: string; // DELETED
  'energy-efficiency': EnergyEfficiency;
  'construction-year': number | null; // MAPPING needed
  floor: Floor | null; // MAPPING needed
  'parking-places': number | null;
  'property-area': number | null;
  'property-area-unit': 'm²';
  furnishing: Furnishing;
  bedrooms: number | null;
  bathrooms: number | null;
  'air-conditioning': AirConditioning;
  pets: Pets;
  alarm: StandardSet;
  attic: StandardSet;
  balcony: StandardSet;
  elevator: StandardSet;
  fireplace: StandardSet;
  garden: StandardSet;
  playroom: StandardSet;
  pool: PoolType;
  storage: StandardSet;
  parking: Parking | null;
  coords: ICoords;
  'plot-area': number | null; // Rent houses and rent plots
  'plot-area-unit': 'm²';
  category: Categories;
  subcategory: string;
  activeDays: number;
  'price-sqm': number;
  updated_at: Date;
  ad_last_updated: Date;
}
