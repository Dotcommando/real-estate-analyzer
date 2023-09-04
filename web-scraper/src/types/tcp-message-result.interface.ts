import { IUrlData } from './url-data.interface';


export interface ITcpMessageResult<T = string> {
  success: boolean;
  data: T;
  urlData: IUrlData;
}
