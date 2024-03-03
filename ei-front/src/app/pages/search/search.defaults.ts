import { ISearchState } from './search.model';


export const SEARCH_STATE_DEFAULT: ISearchState = {
  filters: {
    type: 'rent',
  },
  sorts: {
    city: 1,
    district: 1,
  },
};
