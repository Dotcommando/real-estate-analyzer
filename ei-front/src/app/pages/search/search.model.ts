import {
  AirConditioning,
  Categories,
  Condition,
  EnergyEfficiency,
  Furnishing,
  OnlineViewing,
  Parking,
  Pets,
  PoolType,
  Source,
  StandardSet,
} from '../../../../bff/constants';
import { Range } from '../../types';


export interface ISearchFilters {
  // Primary
  type: 'rent' | 'sale';
  city: string | null;
  district: string[] | null;
  bedrooms: Range<number>;
  bathrooms: Range<number>;
  'price-sqm': Range<number>;
  price: Range<number>;

  // Special
  'priceDeviations.city_avg_mean.monthly_total.medianDelta': Range<number>;
  'priceDeviations.city_avg_mean.monthly_total.meanDelta': Range<number>;
  'priceDeviations.city_avg_mean.monthly_total.medianDeltaSqm': Range<number>;
  'priceDeviations.city_avg_mean.monthly_total.meanDeltaSqm': Range<number>;

  'priceDeviations.city_avg_mean.monthly_intermediary.medianDelta': Range<number>;
  'priceDeviations.city_avg_mean.monthly_intermediary.meanDelta': Range<number>;
  'priceDeviations.city_avg_mean.monthly_intermediary.medianDeltaSqm': Range<number>;
  'priceDeviations.city_avg_mean.monthly_intermediary.meanDeltaSqm': Range<number>;

  'priceDeviations.city_avg_mean.daily_total.medianDelta': Range<number>;
  'priceDeviations.city_avg_mean.daily_total.meanDelta': Range<number>;
  'priceDeviations.city_avg_mean.daily_total.medianDeltaSqm': Range<number>;
  'priceDeviations.city_avg_mean.daily_total.meanDeltaSqm': Range<number>;

  'priceDeviations.district_avg_mean.monthly_total.medianDelta': Range<number>;
  'priceDeviations.district_avg_mean.monthly_total.meanDelta': Range<number>;
  'priceDeviations.district_avg_mean.monthly_total.medianDeltaSqm': Range<number>;
  'priceDeviations.district_avg_mean.monthly_total.meanDeltaSqm': Range<number>;

  'priceDeviations.district_avg_mean.monthly_intermediary.medianDelta': Range<number>;
  'priceDeviations.district_avg_mean.monthly_intermediary.meanDelta': Range<number>;
  'priceDeviations.district_avg_mean.monthly_intermediary.medianDeltaSqm': Range<number>;
  'priceDeviations.district_avg_mean.monthly_intermediary.meanDeltaSqm': Range<number>;

  'priceDeviations.district_avg_mean.daily_total.medianDelta': Range<number>;
  'priceDeviations.district_avg_mean.daily_total.meanDelta': Range<number>;
  'priceDeviations.district_avg_mean.daily_total.medianDeltaSqm': Range<number>;
  'priceDeviations.district_avg_mean.daily_total.meanDeltaSqm': Range<number>;

  // Secondary
  source: Source[] | null;
  'online-viewing': OnlineViewing[] | null;
  'postal-code': string[] | null;
  condition: Condition[] | null;
  'energy-efficiency': EnergyEfficiency[] | null;
  'construction-year': string[] | null;
  floor: string[] | null;
  parking: Parking[] | null;
  'parking-places': Range<number>;
  furnishing: Furnishing[] | null;
  'air-conditioning': AirConditioning[] | null;
  pets: Pets[] | null;
  alarm: StandardSet[] | null;
  attic: StandardSet[] | null;
  balcony: StandardSet[] | null;
  elevator: StandardSet[] | null;
  fireplace: StandardSet[] | null;
  garden: StandardSet[] | null;
  playroom: StandardSet[] | null;
  pool: PoolType[] | null;
  storage: StandardSet[] | null;
  'ad_last_updated': Range<Date> | null;
  'updated_at': Range<Date> | null;
  'plot-area': Range<number> | null;
  category: Categories[] | null;
  subcategory: string[] | null;
  activeDays: Range<number> | null;
}

export interface ISearchSorts {
  url: -1 | 1 | null;
  publish_date: -1 | 1 | null;
  source: -1 | 1 | null;
  city: -1 | 1 | null;
  district: -1 | 1 | null;
  price: -1 | 1 | null;
  'online-viewing': -1 | 1 | null;
  'postal-code': -1 | 1 | null;
  condition: -1 | 1 | null;
  'energy-efficiency': -1 | 1 | null;
  'construction-year': -1 | 1 | null;
  floor: -1 | 1 | null;
  parking: -1 | 1 | null;
  'parking-places': -1 | 1 | null;
  'property-area': -1 | 1 | null;
  furnishing: -1 | 1 | null;
  bedrooms: -1 | 1 | null;
  bathrooms: -1 | 1 | null;
  'air-conditioning': -1 | 1 | null;
  pets: -1 | 1 | null;
  alarm: -1 | 1 | null;
  attic: -1 | 1 | null;
  balcony: -1 | 1 | null;
  elevator: -1 | 1 | null;
  fireplace: -1 | 1 | null;
  garden: -1 | 1 | null;
  playroom: -1 | 1 | null;
  pool: -1 | 1 | null;
  storage: -1 | 1 | null;
  'ad_last_updated': -1 | 1 | null;
  'updated_at': -1 | 1 | null;
  'plot-area': -1 | 1 | null;
  category: -1 | 1 | null;
  subcategory: -1 | 1 | null;
  activeDays: -1 | 1 | null;
  'price-sqm': -1 | 1 | null;
  'priceDeviations.city_avg_mean.monthly_total.medianDelta': -1 | 1 | null;
  'priceDeviations.city_avg_mean.monthly_total.meanDelta': -1 | 1 | null;
  'priceDeviations.city_avg_mean.monthly_total.medianDeltaSqm': -1 | 1 | null;
  'priceDeviations.city_avg_mean.monthly_total.meanDeltaSqm': -1 | 1 | null;
  'priceDeviations.city_avg_mean.monthly_intermediary.medianDelta': -1 | 1 | null;
  'priceDeviations.city_avg_mean.monthly_intermediary.meanDelta': -1 | 1 | null;
  'priceDeviations.city_avg_mean.monthly_intermediary.medianDeltaSqm': -1 | 1 | null;
  'priceDeviations.city_avg_mean.monthly_intermediary.meanDeltaSqm': -1 | 1 | null;
  'priceDeviations.city_avg_mean.daily_total.medianDelta': -1 | 1 | null;
  'priceDeviations.city_avg_mean.daily_total.meanDelta': -1 | 1 | null;
  'priceDeviations.city_avg_mean.daily_total.medianDeltaSqm': -1 | 1 | null;
  'priceDeviations.city_avg_mean.daily_total.meanDeltaSqm': -1 | 1 | null;
  'priceDeviations.district_avg_mean.monthly_total.medianDelta': -1 | 1 | null;
  'priceDeviations.district_avg_mean.monthly_total.meanDelta': -1 | 1 | null;
  'priceDeviations.district_avg_mean.monthly_total.medianDeltaSqm': -1 | 1 | null;
  'priceDeviations.district_avg_mean.monthly_total.meanDeltaSqm': -1 | 1 | null;
  'priceDeviations.district_avg_mean.monthly_intermediary.medianDelta': -1 | 1 | null;
  'priceDeviations.district_avg_mean.monthly_intermediary.meanDelta': -1 | 1 | null;
  'priceDeviations.district_avg_mean.monthly_intermediary.medianDeltaSqm': -1 | 1 | null;
  'priceDeviations.district_avg_mean.monthly_intermediary.meanDeltaSqm': -1 | 1 | null;
  'priceDeviations.district_avg_mean.daily_total.medianDelta': -1 | 1 | null;
  'priceDeviations.district_avg_mean.daily_total.meanDelta': -1 | 1 | null;
  'priceDeviations.district_avg_mean.daily_total.medianDeltaSqm': -1 | 1 | null;
  'priceDeviations.district_avg_mean.daily_total.meanDeltaSqm': -1 | 1 | null;
}

export interface ISearchState {
  filters: Partial<ISearchFilters>;
  sorts: Partial<ISearchSorts>;
}
