import { IRentResidentialId, ISaleResidentialId } from '../../types';
import { ISearchState } from '../search-form/search-form.model';


export interface ISearchResultsStoryNote {
  type: 'rent' | 'sale';
  date: number;
  result: IRentResidentialId[] | ISaleResidentialId[];
  formState: ISearchState;
  offset: number;
  limit: number;
  timestamp: number;
}

export interface ISearchResultsState {
  story: ISearchResultsStoryNote[];
  result: IRentResidentialId[] | ISaleResidentialId[] | null;
  total: number;
  status: 'IDLE' | 'PENDING' | 'SUCCESS' | 'FAILED';
  offset: number;
  limit: number;
  timestamp?: number;
}
