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

  // It's a priority of future Ad tasks.
  // Later, when Pagination or Index task will be completed,
  // it creates Ad tasks with this priority.
  // Use in case of your is Index or Pagination.
  adPriority?: number;
}
