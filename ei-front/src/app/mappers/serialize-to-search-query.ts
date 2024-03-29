import { environment } from '../../environments/environment';
import { PAGINATION_MAX_LIMIT } from '../constants';
import { ISearchFilters, ISearchSorts, ISearchState } from '../store/search-form';


const simpleTypes = [ 'string', 'number', 'boolean' ];
const $gte = encodeURIComponent('[') + '$gte' + encodeURIComponent(']');
const $lte = encodeURIComponent('[') + '$lte' + encodeURIComponent(']');

export function serializeToSearchQuery(searchState: ISearchState, offset = 0, limit = environment.pageSize): string {
  const filters: Partial<ISearchFilters> = searchState.filters;
  const sorts: Partial<ISearchSorts> = searchState.sorts;
  const filterFields: Array<keyof ISearchFilters> = Object.keys(filters) as Array<keyof ISearchFilters>;
  const sortFields: Array<keyof ISearchSorts> = Object.keys(sorts) as Array<keyof ISearchSorts>;

  let resultQuery = `?type=${filters.type}`;

  for (const key of filterFields) {
    if (key === 'type') {
      continue;
    }

    const value = filters[key];
    const fieldName = key.startsWith('priceDeviations')
      ? encodeURIComponent(key.replace(/-/g, '.'))
      : key;

    if (Array.isArray(value)) {
      for (const arrayValue of value) {
        resultQuery += `&${fieldName}=${encodeURIComponent(arrayValue)}`;
      }
    } else if (value !== null && typeof value === 'object' && ('min' in value || 'max' in value)) {
      if ('min' in value && value['min'] !== null) {
        resultQuery += `&${fieldName}${$gte}=${value['min']}`;
      }

      if ('max' in value && value['max'] !== null) {
        resultQuery += `&${fieldName}${$lte}=${value['max']}`;
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
      resultQuery += `&s_${encodeURIComponent(fieldName)}=${value}`;
    }
  }

  resultQuery += `&offset=${offset >= 0 ? offset : 0}&limit=${limit > 0 ? Math.min(limit, PAGINATION_MAX_LIMIT) : environment.pageSize}`;

  return resultQuery;
}
