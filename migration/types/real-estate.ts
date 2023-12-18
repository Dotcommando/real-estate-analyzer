import { Document } from 'mongoose';

import { ICoords } from './coords.interface';

import { Mode, OnlineViewing, Source } from '../constants';


export interface IRealEstate {
  url: string;
  title: string;
  description: string;
  publish_date: Date | number;
  source: Source;
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
  coords?: ICoords;
  expired?: boolean;
  updated_at: Date;
  ad_last_updated: Date;
  version: string;
  mode?: Mode; // To delete
  'square-meter-price': string; // To delete
}

export interface IRealEstateDoc extends IRealEstate, Document {
  active_dates: Date[];
}
