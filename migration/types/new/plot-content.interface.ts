import { Share } from '../../constants';
import { ICoords } from '../coords.interface';


export interface IPlotContent<T_id = string> {
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
  'area': number;
  'area-unit': 'm²';
  share: Share;
  'planning-zone': string;
  active_dates: Date[];
  coords: ICoords;
  'price-sqm': number;
  photo: string[];
  updated_at: Date;
  ad_last_updated: Date;
  version: string;
}
