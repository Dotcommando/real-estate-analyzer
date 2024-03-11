import { ISearchForm, ISearchState } from '../pages/search/search.model';
import { IDistrictOption } from '../types';


export function mapSearchFormToState(data: Partial<ISearchForm>): Partial<ISearchState> {
  return {
    filters: {
      ...(data.cityDistrict && {
        ...(data.cityDistrict?.districts && { district: data?.cityDistrict?.districts.map((district: IDistrictOption) => district.value) ?? []}),
        ...(data.cityDistrict?.city !== undefined && { city: data.cityDistrict.city }),
      }),
      ...(data.price && { price: data.price }),
      ...(data.priceSqm && { 'price-sqm': data.priceSqm }),
      ...(data.bedrooms && { bedrooms: data.bedrooms }),
      ...(data.bathrooms && { bathrooms: data.bathrooms }),
      ...(data.propertyArea && { 'property-area': data.propertyArea }),
    },
  };
}
