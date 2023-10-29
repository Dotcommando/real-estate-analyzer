import { UrlTypes } from '../constants';


export interface ITask {
  priority: number; // Higher - better
  url: string;
  urlType: UrlTypes;
  collection: string;
  queueName: string;
  cacheTtl?: number;
  depth?: number;
  host: string;
  port: number | string;
}
