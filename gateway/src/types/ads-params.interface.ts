import { AdsEnum } from 'src/constants';


export interface IAdsParams {
  startDate: Date;
  endDate: Date;
  limit: number;
  offset: number;
  city: string;
  district: string;
  ads: AdsEnum;
}
