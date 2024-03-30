import cloneDeep from 'lodash.clonedeep';

import { ISearchState } from './search-form.model';


export const SEARCH_STATE_DEFAULT: ISearchState = {
  filters: {
    // Primary
    type: 'rent',
    city: null,
    district: null,
    bedrooms: null,
    bathrooms: null,
    'price-sqm': null,
    price: null,

    // Special
    'priceDeviations-city_avg_mean-monthly_total-medianDelta': null,
    'priceDeviations-city_avg_mean-monthly_total-meanDelta': null,
    'priceDeviations-city_avg_mean-monthly_total-medianDeltaSqm': null,
    'priceDeviations-city_avg_mean-monthly_total-meanDeltaSqm': null,

    'priceDeviations-city_avg_mean-monthly_intermediary-medianDelta': null,
    'priceDeviations-city_avg_mean-monthly_intermediary-meanDelta': null,
    'priceDeviations-city_avg_mean-monthly_intermediary-medianDeltaSqm': null,
    'priceDeviations-city_avg_mean-monthly_intermediary-meanDeltaSqm': null,

    'priceDeviations-city_avg_mean-daily_total-medianDelta': null,
    'priceDeviations-city_avg_mean-daily_total-meanDelta': null,
    'priceDeviations-city_avg_mean-daily_total-medianDeltaSqm': null,
    'priceDeviations-city_avg_mean-daily_total-meanDeltaSqm': null,

    'priceDeviations-district_avg_mean-monthly_total-medianDelta': null,
    'priceDeviations-district_avg_mean-monthly_total-meanDelta': null,
    'priceDeviations-district_avg_mean-monthly_total-medianDeltaSqm': null,
    'priceDeviations-district_avg_mean-monthly_total-meanDeltaSqm': null,

    'priceDeviations-district_avg_mean-monthly_intermediary-medianDelta': null,
    'priceDeviations-district_avg_mean-monthly_intermediary-meanDelta': null,
    'priceDeviations-district_avg_mean-monthly_intermediary-medianDeltaSqm': null,
    'priceDeviations-district_avg_mean-monthly_intermediary-meanDeltaSqm': null,

    'priceDeviations-district_avg_mean-daily_total-medianDelta': null,
    'priceDeviations-district_avg_mean-daily_total-meanDelta': null,
    'priceDeviations-district_avg_mean-daily_total-medianDeltaSqm': null,
    'priceDeviations-district_avg_mean-daily_total-meanDeltaSqm': null,

    // Secondary
    source: null,
    'online-viewing': null,
    'postal-code': null,
    condition: null,
    'energy-efficiency': null,
    'construction-year': null,
    floor: null,
    parking: null,
    'parking-places': null,
    furnishing: null,
    'air-conditioning': null,
    pets: null,
    alarm: null,
    attic: null,
    balcony: null,
    elevator: null,
    fireplace: null,
    garden: null,
    playroom: null,
    pool: null,
    storage: null,
    'ad_last_updated': null,
    'updated_at': null,
    'plot-area': null,
    category: null,
    subcategory: null,
    activeDays: null,
  },
  sorts: {
    ad_last_updated: -1,
    url: null,
    publish_date: null,
    source: null,
    city: null,
    district: null,
    price: null,
    'online-viewing': null,
    'postal-code': null,
    condition: null,
    'energy-efficiency': null,
    'construction-year': null,
    floor: null,
    parking: null,
    'parking-places': null,
    'property-area': null,
    furnishing: null,
    bedrooms: null,
    bathrooms: null,
    'air-conditioning': null,
    pets: null,
    alarm: null,
    attic: null,
    balcony: null,
    elevator: null,
    fireplace: null,
    garden: null,
    playroom: null,
    pool: null,
    storage: null,
    'updated_at': null,
    'plot-area': null,
    category: null,
    subcategory: null,
    activeDays: null,
    'price-sqm': null,
    'priceDeviations-city_avg_mean-monthly_total-medianDelta': null,
    'priceDeviations-city_avg_mean-monthly_total-meanDelta': null,
    'priceDeviations-city_avg_mean-monthly_total-medianDeltaSqm': null,
    'priceDeviations-city_avg_mean-monthly_total-meanDeltaSqm': null,
    'priceDeviations-city_avg_mean-monthly_intermediary-medianDelta': null,
    'priceDeviations-city_avg_mean-monthly_intermediary-meanDelta': null,
    'priceDeviations-city_avg_mean-monthly_intermediary-medianDeltaSqm': null,
    'priceDeviations-city_avg_mean-monthly_intermediary-meanDeltaSqm': null,
    'priceDeviations-city_avg_mean-daily_total-medianDelta': null,
    'priceDeviations-city_avg_mean-daily_total-meanDelta': null,
    'priceDeviations-city_avg_mean-daily_total-medianDeltaSqm': null,
    'priceDeviations-city_avg_mean-daily_total-meanDeltaSqm': null,
    'priceDeviations-district_avg_mean-monthly_total-medianDelta': null,
    'priceDeviations-district_avg_mean-monthly_total-meanDelta': null,
    'priceDeviations-district_avg_mean-monthly_total-medianDeltaSqm': null,
    'priceDeviations-district_avg_mean-monthly_total-meanDeltaSqm': null,
    'priceDeviations-district_avg_mean-monthly_intermediary-medianDelta': null,
    'priceDeviations-district_avg_mean-monthly_intermediary-meanDelta': null,
    'priceDeviations-district_avg_mean-monthly_intermediary-medianDeltaSqm': null,
    'priceDeviations-district_avg_mean-monthly_intermediary-meanDeltaSqm': null,
    'priceDeviations-district_avg_mean-daily_total-medianDelta': null,
    'priceDeviations-district_avg_mean-daily_total-meanDelta': null,
    'priceDeviations-district_avg_mean-daily_total-medianDeltaSqm': null,
    'priceDeviations-district_avg_mean-daily_total-meanDeltaSqm': null,
  },
};

export const SEARCH_RENT_STATE_DEFAULT: ISearchState = {
  filters: {
    ...cloneDeep(SEARCH_STATE_DEFAULT.filters),
    type: 'rent',
  },
  sorts: {
    ...cloneDeep(SEARCH_STATE_DEFAULT.sorts),
  },
};

export const SEARCH_SALE_STATE_DEFAULT: ISearchState = {
  filters: {
    ...cloneDeep(SEARCH_STATE_DEFAULT.filters),
    type: 'sale',
  },
  sorts: {
    ...cloneDeep(SEARCH_STATE_DEFAULT.sorts),
  },
};
