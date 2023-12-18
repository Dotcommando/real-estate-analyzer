import { IRealEstate } from './real-estate';


export interface IAdDBOperationResult<T = IRealEstate> {
  ad: T | null;
  status: string;
  errorMsg?: string;
}
