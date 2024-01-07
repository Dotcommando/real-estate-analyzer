import { ObjectId } from 'mongodb';

import { IAnalysis, IAnalysisDoc, ICityStats, ICityStatsDoc } from '../types';


export function cityStatsMapper(doc: ICityStatsDoc): ICityStats {
  return {
    city: doc.city,
    'total-area': doc['total-area'],
    'total-price': doc['total-price'],
    'mean-price': doc['mean-price'],
    'median-price': doc['median-price'],
    'price-percentile-25': doc['price-percentile-25'],
    'price-percentile-75': doc['price-percentile-75'],
    'mean-price-sqm': doc['mean-price-sqm'],
    'median-price-sqm': doc['median-price-sqm'],
  };
}

export function analysisCityMapper(doc: IAnalysisDoc<ObjectId, ICityStatsDoc>): IAnalysis<string, ICityStats> {
  return {
    _id: doc._id.toString(),
    start_date: doc.start_date,
    end_date: doc.end_date,
    analysis_type: doc.analysis_type,
    analysis_period: doc.analysis_period,
    analysis_version: doc.analysis_version,
    data: doc.data.map((statDoc) => cityStatsMapper(statDoc)),
  };
}

export function restoreAnalysisCityFromCache(doc: string): IAnalysis<string, ICityStats> | null {
  try {
    const parsed = JSON.parse(doc);

    return {
      ...parsed,
      start_date: new Date(parsed.start_date),
      end_date: new Date(parsed.end_date),
    };
  } catch (e) {
    return null;
  }
}
