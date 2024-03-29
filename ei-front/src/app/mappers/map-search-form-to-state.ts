import { ISearchForm, ISearchState } from '../store/search-form';
import { IDistrictOption, Range } from '../types';


export function mapSearchFormToState(data: Partial<ISearchForm>): Partial<ISearchState> {
  const priceDeviationsFieldNames: Array<keyof ISearchForm> = (Object.keys(data) as Array<keyof ISearchForm>)
    .filter((key: keyof ISearchForm) => key.startsWith('priceDeviations'));
  const priceDeviationsFields: any = {};

  for (const fieldName of priceDeviationsFieldNames) {
    if (data[fieldName] !== null && typeof data[fieldName] === 'object') {
      priceDeviationsFields[fieldName] = {} as Partial<Range<number>>;

      if ('min' in (data[fieldName] as unknown as object) && (data[fieldName] as Partial<Range<number>>)['min'] !== null) {
        priceDeviationsFields[fieldName].min = (data[fieldName] as Partial<Range<number>>).min;
      }

      if ('max' in (data[fieldName] as unknown as object) && (data[fieldName] as Partial<Range<number>>)['max'] !== null) {
        priceDeviationsFields[fieldName].max = (data[fieldName] as Partial<Range<number>>).max;
      }
    }
  }

  return {
    filters: {
      ...(data.cityDistrict && {
        ...(data.cityDistrict?.districts && {
          district: data?.cityDistrict?.districts
            .filter(Boolean)
            .map((district: IDistrictOption | string) => typeof district === 'string' ? district : district.value) ?? [],
        }),
        ...(data.cityDistrict?.city !== undefined && { city: data.cityDistrict.city }),
      }),
      ...(data.subcategory && { subcategory: data.subcategory }),
      ...(data.price && { price: data.price }),
      ...(data.priceSqm && { 'price-sqm': data.priceSqm }),
      ...(data.bedrooms && { bedrooms: data.bedrooms }),
      ...(data.bathrooms && { bathrooms: data.bathrooms }),
      ...(data.propertyArea && { 'property-area': data.propertyArea }),
      ...priceDeviationsFields,
    },
  };
}
