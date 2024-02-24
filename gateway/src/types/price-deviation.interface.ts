import { NoStatisticsDataReason } from '../constants';


export interface IPriceDeviation {
  medianDelta?: number;
  meanDelta?: number;
  medianDeltaSqm?: number;
  meanDeltaSqm?: number;
  noDataAbsReason?: NoStatisticsDataReason;
  noDataSqmReason?: NoStatisticsDataReason;
}
