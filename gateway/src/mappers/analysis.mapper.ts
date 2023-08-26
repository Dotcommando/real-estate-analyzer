import { IAnalysisResult } from '../types';


export function analysisMapper<T extends IAnalysisResult<U>, U extends V, V>(docs: T[], innerMapper: (docs: U[]) => V[]): T[] {
  if (!docs.length) {
    return [];
  }

  const result: T[] = [];

  for (const report of docs) {
    const newReport = {
      start_date: report.start_date,
      end_date: report.end_date,
      analysis_type: report.analysis_type,
      analysis_period: report.analysis_period,
      data: report?.data?.length ? innerMapper(report.data) : [],
    };

    result.push(newReport as T);
  }

  return result;
}
