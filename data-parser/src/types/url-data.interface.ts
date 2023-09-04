import { UrlTypes } from '../constants';


export interface IUrlData {
  priority: number; // Higher - better
  url: string;
  urlType: UrlTypes;
  category: string;
  queueName?: string;
  cacheTtl?: number;
}
