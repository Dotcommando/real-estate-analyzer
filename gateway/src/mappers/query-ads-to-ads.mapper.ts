import { AdsEnum, AnalysisPeriod, AnalysisType, MINIMAL_START_DATE } from '../constants';
import { AdsDto, StatsDto } from '../dto';
import { IAdsParams, IAnalysisParams } from '../types';


export function queryAdsToAds(queryAds: AdsDto): IAdsParams {
  const endOfDay = new Date();

  endOfDay.setUTCHours(23, 59, 59, 999);

  const startDate = queryAds.start_date.getTime() < MINIMAL_START_DATE.getTime()
    ? new Date(MINIMAL_START_DATE.getTime())
    : queryAds.start_date;
  const endDate = queryAds.end_date
    ? queryAds.end_date.getTime() > endOfDay.getTime()
      ? endOfDay
      : queryAds.end_date
    : endOfDay;

  endDate.setUTCHours(23, 59, 59, 999);

  return {
    startDate,
    endDate,
    limit: queryAds.limit,
    offset: queryAds.offset,
    city: queryAds.city,
    district: queryAds.district,
    ads: queryAds.ads ?? AdsEnum.RentFlats,
  };
}
