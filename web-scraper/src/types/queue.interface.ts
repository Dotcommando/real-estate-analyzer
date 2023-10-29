import { ITask } from './task.interface';


export interface IQueueElement extends ITask {
  attempt?: number;
}

export interface IQueue {
  priorities: Record<string, IQueueElement[]>;
  lastLaunchMsec: number;
}
