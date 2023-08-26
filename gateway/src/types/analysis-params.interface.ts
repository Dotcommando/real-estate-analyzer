import { AdsEnum, AnalysisPeriod, AnalysisType } from '../constants';


export interface IAnalysisParams {
  startDate: Date;
  endDate: Date;
  analysisType: AnalysisType;
  analysisPeriod: AnalysisPeriod;
  ads: AdsEnum;
}
