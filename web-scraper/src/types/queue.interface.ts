import { IUrlData } from './url-data.interface';


export interface IQueue {
  [priority: number]: Omit<IUrlData, 'queueName'>[];
}
