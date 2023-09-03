import { UrlTypes } from '../constants';


export interface IUrlData {
  priority: number; // Higher - better
  url: string;
  urlType: UrlTypes;
  category: string;
  cacheTtl?: number;
}
