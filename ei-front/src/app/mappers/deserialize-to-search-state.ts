import { ParamMap } from '@angular/router';

import {
  allSortFields,
  arrayFields,
  ISearchFilters,
  ISearchSorts,
  ISearchState,
  rangesFields,
  regularFields,
} from '../components/search-form/search.model';
import { PAGINATION_MAX_LIMIT } from '../constants';
import { Range } from '../types';


function hasRangeAttribute(key: string): boolean {
  return /\[\$gte\]$/.test(key)
    || /\[\$gt\]$/.test(key)
    || /\[\$eq\]$/.test(key)
    || /\[\$lt\]$/.test(key)
    || /\[\$lte\]$/.test(key);
}

function getClearedFieldName(key: string): string {
  return key
    .replace(/\[\$gte\]$/, '')
    .replace(/\[\$gt\]$/, '')
    .replace(/\[\$eq\]$/, '')
    .replace(/\[\$lt\]$/, '')
    .replace(/\[\$lte\]$/, '');
}

function getRangeField(field: string, value: any, object: Partial<Range<any>>): Partial<Range<any>> {
  const valueAsNumber = Number(value);

  if (String(valueAsNumber) !== value) {
    return object;
  }

  if (/\[\$gte\]$/.test(field)) {
    object.min = valueAsNumber;
  }

  if (/\[\$gt\]$/.test(field)) {
    object.min = valueAsNumber;
  }

  if (/\[\$eq\]$/.test(field)) {
    object.max = valueAsNumber;
    object.min = valueAsNumber;
  }

  if (/\[\$lt\]$/.test(field)) {
    object.max = valueAsNumber;
  }

  if (/\[\$lte\]$/.test(field)) {
    object.max = valueAsNumber;
  }

  return object;
}

export function deserializeToSearchState(paramMap: ParamMap): ISearchState {
  const filters: Partial<ISearchFilters> = {};
  const sorts: Partial<ISearchSorts> = {};
  const queryParams: Record<string, any> = {};

  paramMap.keys.forEach((key) => {
    const values = paramMap.getAll(key);
    let fieldName = getClearedFieldName(key);

    if (fieldName.startsWith('priceDeviations')) {
      fieldName = fieldName.replace(/\./g, '-');
    }

    if (values.length > 1) {
      queryParams[fieldName] = values;
    } else {
      if (fieldName !== key) {
        if (!queryParams[fieldName]) {
          queryParams[fieldName] = {};
        }

        queryParams[fieldName] = getRangeField(key, values[0], queryParams[fieldName]);
      } else {
        queryParams[fieldName] = values[0];
      }
    }
  });

  const filterKeys = Object.keys(queryParams).filter((key: string) => !key.startsWith('s_'));
  const sortKeys = Object.keys(queryParams).filter((key: string) => key.startsWith('s_'));

  for (const key of filterKeys) {
    if (rangesFields.includes(key as keyof ISearchFilters) || arrayFields.includes(key as keyof ISearchFilters) || regularFields.includes(key as keyof ISearchFilters)) {
      filters[key as keyof ISearchFilters] = queryParams[key];
    }
  }

  for (const key of sortKeys) {
    let fieldName = key.replace(/^s_/, '');

    if (fieldName.startsWith('priceDeviations')) {
      fieldName = fieldName.replace(/\./g, '-');
    }

    if (allSortFields.includes(fieldName as keyof ISearchSorts)) {
      sorts[fieldName as keyof ISearchSorts] = queryParams[key] === '1' ? 1 : -1;
    }
  }

  const offset = queryParams['offset'] ? parseInt(queryParams['offset']) : 0;
  const limit = queryParams['limit'] ? parseInt(queryParams['limit']) : PAGINATION_MAX_LIMIT;

  return {
    filters,
    sorts,
    offset: isNaN(offset) ? 0 : offset,
    limit: isNaN(limit) ? PAGINATION_MAX_LIMIT : limit,
  } as ISearchState;
}
