import { IRentResidentialId, ISaleResidentialId } from '../../types';
import { ISearchState } from '../search-form/search.model';


export interface ISearchResultsStoryNote {
  type: 'rent' | 'sale';
  date: number;
  result: IRentResidentialId[] | ISaleResidentialId[];
  formState: ISearchState;
}

export interface ISearchResultsState {
  story: ISearchResultsStoryNote[];
  result: IRentResidentialId[] | ISaleResidentialId[] | null;
  total: number;
  status: 'IDLE' | 'PENDING' | 'SUCCESS' | 'FAILED';
}
