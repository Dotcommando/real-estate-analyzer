export interface ISearchFilters {
  type: 'rent' | 'sale';
  city: string;
  district: string;
}

export interface ISearchSorts {
  city: -1 | 1;
  district: -1 | 1;
}

export interface ISearchState {
  filters: Partial<ISearchFilters>;
  sorts: Partial<ISearchSorts>;
}
