import { ITcpResponse } from './tcp-response.interface';
import { IUrlData } from './url-data.interface';


export interface IWebScrapingResponse extends ITcpResponse<string> {
  urlData: IUrlData;
}
