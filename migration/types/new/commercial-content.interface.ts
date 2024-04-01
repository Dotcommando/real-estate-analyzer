import {
  AirConditioning,
  Categories,
  CommercialType,
  EnergyEfficiency,
  Furnishing,
  Parking,
  PoolType,
  StandardSet,
} from '../../constants';
import { ICoords } from '../coords.interface';


export interface ICommercialContent<T_id = string> {
  _id: T_id;
  ad: T_id;
  title: string;
  description: string;
  publish_date: Date;
  address: string;
  city: string;
  district: string | null;
  price: number;
  currency: string;
  'postal-code': number | null; // MAPPING needed
  'energy-efficiency': EnergyEfficiency;
  'construction-year': number | null; // MAPPING needed
  'parking-places': number | null;
  'area': number | null;
  'area-unit': 'm²';
  'plot-area': number | null;
  'plot-area-unit': 'm²';
  furnishing: Furnishing;
  bedrooms: number | null;
  bathrooms: number | null;
  'air-conditioning': AirConditioning;
  alarm: StandardSet;
  attic: StandardSet;
  balcony: StandardSet;
  elevator: StandardSet;
  fireplace: StandardSet;
  garden: StandardSet;
  playroom: StandardSet;
  pool: PoolType;
  storage: StandardSet;
  parking: Parking;
  coords: ICoords;
  category: Categories.Commercial;
  subcategory: CommercialType;
  activeDays: number;
  'price-sqm': number;
  photo: string[];
  updated_at: Date;
  ad_last_updated: Date;
  version: string;
}
