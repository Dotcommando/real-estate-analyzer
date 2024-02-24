import { IPriceDeviation } from './price-deviation.interface';

import { AnalysisPeriod } from '../constants';


export interface IAnalysisTypeDeviations {
  [AnalysisPeriod.MONTHLY_TOTAL]: IPriceDeviation;
  [AnalysisPeriod.MONTHLY_INTERMEDIARY]: IPriceDeviation;
  [AnalysisPeriod.DAILY_TOTAL]: IPriceDeviation;
}
