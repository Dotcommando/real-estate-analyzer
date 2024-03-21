import { ISearchResultsState } from './search-results.model';


export const SEARCH_RESULTS_STATE_DEFAULT: ISearchResultsState = {
  story: [],
  result: null,
  total: 0,
  status: 'IDLE',
  limit: 25,
  offset: 0,
};
