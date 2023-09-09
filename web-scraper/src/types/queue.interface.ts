import { IUrlData } from './url-data.interface';


export interface IQueueElement extends Omit<IUrlData, 'queueName'> {
  attempt?: number;
}

export interface IQueue {
  priorities: Record<string, IQueueElement[]>;
  lastLaunchMsec: number;
}
