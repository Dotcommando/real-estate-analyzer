import { ISearchFilters, ISearchSorts, ISearchState } from '../pages/search/search.model';


const simpleTypes = [ 'string', 'number', 'boolean' ];

export function serializeToSearchQuery(searchState: ISearchState): string {
  const filters: Partial<ISearchFilters> = searchState.filters;
  const sorts: Partial<ISearchSorts> = searchState.sorts;
  const filterFields: Array<keyof ISearchFilters> = Object.keys(filters) as Array<keyof ISearchFilters>;
  const sortFields: Array<keyof ISearchSorts> = Object.keys(sorts) as Array<keyof ISearchSorts>;

  let resultQuery = `?type=${filters.type}`;

  for (const key of filterFields) {
    const value = filters[key];
    const fieldName = key.startsWith('priceDeviations')
      ? key.replace(/-/g, '.')
      : key;

    if (Array.isArray(value)) {
      for (const arrayValue of value) {
        resultQuery += `&${fieldName}=${encodeURIComponent(arrayValue)}`;
      }
    } else if (value !== null && typeof value === 'object' && ('min' in value || 'max' in value)) {
      if ('min' in value && value['min'] !== null) {
        resultQuery += `&${fieldName}[$gte]=${value['min']}`;
      }

      if ('max' in value && value['max'] !== null) {
        resultQuery += `&${fieldName}[$lte]=${value['max']}`;
      }
    } else if (simpleTypes.includes(typeof value)) {
      resultQuery += `&${fieldName}=${encodeURIComponent(String(value))}`;
    }
  }

  for (const key of sortFields) {
    const value = sorts[key];
    const fieldName = key.startsWith('priceDeviations')
      ? key.replace(/-/g, '.')
      : key;

    if (value === 1 || value === -1) {
      resultQuery += `&s_${fieldName}=${value}`;
    }
  }

  return resultQuery;
}
