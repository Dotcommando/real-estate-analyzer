import { IAnalysisTypeDeviations } from './analysis-type-deviations.interface';

import { AnalysisType } from '../constants';


export interface IPriceDeviations {
  [AnalysisType.CITY_AVG_MEAN]: IAnalysisTypeDeviations;
  [AnalysisType.DISTRICT_AVG_MEAN]: IAnalysisTypeDeviations;
}
