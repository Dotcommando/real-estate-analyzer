import { IPriceDeviation } from './price-deviation.interface';
import { IRentApartmentsFlats, IRentHouses } from './real-estate-to-rent';

import { AnalysisPeriod, AnalysisType, Categories } from '../constants';


export interface IAnalysisTypeDeviations {
  [AnalysisPeriod.MONTHLY_TOTAL]: IPriceDeviation;
  [AnalysisPeriod.MONTHLY_INTERMEDIARY]: IPriceDeviation;
  [AnalysisPeriod.DAILY_TOTAL]: IPriceDeviation;
}

export interface IPriceDeviations {
  [AnalysisType.CITY_AVG_MEAN]: IAnalysisTypeDeviations;
  [AnalysisType.DISTRICT_AVG_MEAN]: IAnalysisTypeDeviations;
}

export interface IRentResidential extends Omit<IRentApartmentsFlats, 'type' | 'version' | 'expired'>, Omit<IRentHouses, 'type' | 'version' | 'expired'> {
  category: Categories;
  subcategory: string;
  activeDays: number;
  priceDeviations: IPriceDeviations;
}
