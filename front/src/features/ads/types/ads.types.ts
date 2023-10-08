import { RealEstateObject } from '../../../types/real-estate.type';
import { AdsEnum } from '../../statistic/statistic.type';

export type AdsQueryParams = {
  startDate: string;
  limit?: number;
  offset?: number;
  endDate?: string;
  city?: string;
  district?: string;
  ads: AdsEnum;
};

export type AdsResponse = RealEstateObject[];
