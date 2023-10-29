import { ITask } from './task.interface';
import { ITcpResponse } from './tcp-response.interface';


export interface IWebScrapingResponse extends ITcpResponse<string> {
  task: ITask;
}
