import { CountryEnum } from '../country/country.enum';

export type DistrictStats = {
  'city': string;
  'district': string;
  'median-sqm': number;
  'mean-sqm': number;
  'count': number;
  'percentile-25-sqm': number;
  'percentile-75-sqm': number;
  'total-area': number;
  'total-price': number;
  'median-price': number;
  'mean-price': number;
  'percentile-25-price': number;
  'percentile-75-price': number;
};

export type DistrictParams = {
  country: CountryEnum;
};

export type DistrictsResponse = {
  city: string;
  districts: string[];
};
