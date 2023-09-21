import { AdsEnum, AnalysisPeriod, AnalysisType, MINIMAL_START_DATE } from '../constants';
import { AdsDto, StatsDto } from '../dto';
import { IAdsParams, IAnalysisParams } from '../types';


export function queryAdsToAds(queryStats: AdsDto): IAdsParams {
  const endOfDay = new Date();

  endOfDay.setUTCHours(23, 59, 59, 999);

  const startDate = queryStats.start_date.getTime() < MINIMAL_START_DATE.getTime()
    ? new Date(MINIMAL_START_DATE.getTime())
    : queryStats.start_date;
  const endDate = queryStats.end_date
    ? queryStats.end_date.getTime() > endOfDay.getTime()
      ? endOfDay
      : queryStats.end_date
    : endOfDay;

  endDate.setUTCHours(23, 59, 59, 999);

  return {
    startDate,
    endDate,
  };
}
