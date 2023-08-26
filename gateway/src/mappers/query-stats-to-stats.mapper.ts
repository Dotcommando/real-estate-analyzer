import { AdsEnum, AnalysisPeriod, AnalysisType, MINIMAL_START_DATE } from '../constants';
import { StatsDto } from '../dto';
import { IAnalysisParams } from '../types';


export function queryStatsToStats(queryStats: StatsDto): IAnalysisParams {
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
    analysisType: queryStats.analysis_type ?? AnalysisType.CITY_AVG_MEAN,
    analysisPeriod: queryStats.analysis_period ?? AnalysisPeriod.MONTHLY_TOTAL,
    ads: queryStats.ads ?? AdsEnum.RentFlats,
  };
}
