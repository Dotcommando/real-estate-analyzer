import { ISearchForm, ISearchState } from '../pages/search/search.model';


export function mapSearchFormToState(data: Partial<ISearchForm>): Partial<ISearchState> {
  return {
    filters: {
      ...(data.city && { city: data.city }),
      ...(data.district && { district: data.district }),
      ...(data.price && { price: data.price }),
      ...(data.priceSqm && { 'price-sqm': data.priceSqm }),
      ...(data.bedrooms && { bedrooms: data.bedrooms }),
      ...(data.bathrooms && { bathrooms: data.bathrooms }),
      ...(data.propertyArea && { 'property-area': data.propertyArea }),
    },
  };
}
