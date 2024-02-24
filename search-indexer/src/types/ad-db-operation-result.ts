import { IRealEstate } from './real-estate.interface';


export interface IAdDBOperationResult<T = IRealEstate> {
  ad: T | null;
  status: string;
  errorMsg?: string;
}
