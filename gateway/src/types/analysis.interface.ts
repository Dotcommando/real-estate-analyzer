import { AnalysisPeriod, AnalysisType } from '../constants';


export interface IAnalysis<Id = string, T = unknown> {
  _id: Id;
  start_date: Date;
  end_date: Date;
  analysis_type: AnalysisType;
  analysis_period: AnalysisPeriod;
  analysis_version: string;
  data: T[];
}
