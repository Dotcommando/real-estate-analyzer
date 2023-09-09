import { UrlTypes } from '../constants';


export interface IUrlData {
  priority: number; // Higher - better
  url: string;
  urlType: UrlTypes;
  collection: string;
  queueName?: string;
  cacheTtl?: number;
  depth?: number;
}
