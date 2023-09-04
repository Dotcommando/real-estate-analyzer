import { ICoords } from './coords';

import { OnlineViewing } from '../constants';


export interface IRealEstate {
  url: string;
  title: string;
  description: string;
  publish_date: Date;
  city: string;
  district?: string;
  price: number;
  currency: string;
  ad_id: string;
  'online-viewing'?: OnlineViewing;
  'postal-code': string;
  'reference-number'?: string;
  'registration-number'?: number;
  'registration-block'?: number;
  'square-meter-price': number;
  coords?: ICoords;
  expired?: boolean;
}