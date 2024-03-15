import { ISearchFilters, ISearchForm, ISearchState } from '../pages/search/search.model';
import { Range } from '../types';


export function mapStateToSearchForm(state: ISearchState): Partial<ISearchForm> {
  const formValue: any = {};

  if (state.filters.city || state.filters.district) {
    formValue.cityDistrict = {
      city: state.filters.city ? state.filters.city : null,
      districts: state.filters.district ? state.filters.district : [],
    };
  }

  if (state.filters.price !== null) {
    formValue.price = { min: null, max: null };

    if (typeof state.filters.price?.min === 'number') {
      formValue.price.min = state.filters.price.min;
    }

    if (typeof state.filters.price?.max === 'number') {
      formValue.price.max = state.filters.price.max;
    }
  }

  if (state.filters['price-sqm'] !== null) {
    formValue.priceSqm = { min: null, max: null };

    if (typeof state.filters['price-sqm']?.min === 'number') {
      formValue.priceSqm.min = state.filters['price-sqm'].min;
    }

    if (typeof state.filters['price-sqm']?.max === 'number') {
      formValue.priceSqm.max = state.filters['price-sqm'].max;
    }
  }

  if (state.filters.bedrooms !== null) {
    formValue.bedrooms = [];

    if (Array.isArray(state.filters.bedrooms)) {
      formValue.bedrooms = [ ...state.filters.bedrooms ];
    }
  }

  if (state.filters.bathrooms !== null) {
    formValue.bathrooms = [];

    if (Array.isArray(state.filters.bathrooms)) {
      formValue.bathrooms = [ ...state.filters.bathrooms ];
    }
  }

  if (state.filters['property-area'] !== null) {
    formValue.propertyArea = { min: null, max: null };

    if (typeof state.filters['property-area']?.min === 'number') {
      formValue.propertyArea.min = state.filters['property-area'].min;
    }

    if (typeof state.filters['property-area']?.max === 'number') {
      formValue.propertyArea.max = state.filters['property-area'].max;
    }
  }

  if (Array.isArray(state.filters.subcategory)) {
    formValue.subcategory = state.filters.subcategory;
  }

  const priceDeviationsFieldNames: Array<keyof ISearchFilters> = (Object.keys(state.filters) as Array<keyof ISearchFilters>)
    .filter((key: keyof ISearchFilters) => key.startsWith('priceDeviations'));

  for (const fieldName of priceDeviationsFieldNames) {
    if (state.filters[fieldName] !== null && typeof state.filters[fieldName] === 'object') {
      formValue[fieldName] = {};

      if ('min' in (state.filters[fieldName] as unknown as object) && (state.filters[fieldName] as unknown as Range<number>)['min'] !== null) {
        formValue[fieldName].min = (state.filters[fieldName] as unknown as Range<number>).min;
      }

      if ('max' in (state.filters[fieldName] as unknown as object) && (state.filters[fieldName] as unknown as Range<number>)['max'] !== null) {
        formValue[fieldName].max = (state.filters[fieldName] as unknown as Range<number>).max;
      }
    }
  }

  return formValue;
}
