import { ISearchResultsState } from './search-results.model';

import { environment } from '../../../environments/environment';


export const SEARCH_RESULTS_STATE_DEFAULT: ISearchResultsState = {
  story: [],
  result: null,
  total: 0,
  status: 'IDLE',
  limit: environment.pageSize,
  offset: 0,
};
