import { round } from './round.mapper';

import { IAnalysisResult } from '../types';


export function roundNumbersInReport<T extends IAnalysisResult<any>>(docs: T[]): T[] {
  if (!docs.length) {
    return docs;
  }

  const result: T[] = [];

  for (const report of docs) {
    const processedReport: T = { ...report };

    processedReport.data = [];

    for (const note of report.data) {
      const newNote: T = {} as T;

      for (const key in note) {
        const value = note[key];

        newNote[key] = typeof value === 'number'
          ? (Math.round(value) !== value
            ? round(value)
            : value
          ) as T[Extract<keyof T, string>]
          : value;
      }

      processedReport.data.push(newNote);
    }

    result.push(processedReport);
  }

  return result;
}
