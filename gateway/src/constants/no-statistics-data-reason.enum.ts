export enum NoStatisticsDataReason {
  NO_CITY = 'no_city',
  NO_DISTRICT = 'no_district',
  NO_PROPERTY_AREA = 'no_property_area',
  NO_PRICE = 'no_price',
  NO_CITY_STAT_FOUND = 'no_city_stat_found',
  NO_DISTRICT_STAT_FOUND = 'no_district_stat_found',
}

export const NoStatisticsDataReasonArray = Object.values(NoStatisticsDataReason);
