import { IUrlData } from './url-data.interface';


export interface ITcpResponse<T = string> {
  success: boolean;
  data: T;
  urlData: IUrlData[];
}
