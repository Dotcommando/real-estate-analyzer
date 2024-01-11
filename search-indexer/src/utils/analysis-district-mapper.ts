import { ObjectId } from 'mongodb';

import { IAnalysis, IAnalysisDoc, IDistrictStats, IDistrictStatsDoc } from '../types';


export function districtStatsMapper(doc: IDistrictStatsDoc): IDistrictStats {
  return {
    city: doc.city,
    district: doc.district,
    'median-sqm': doc['median-sqm'],
    'mean-sqm': doc['mean-sqm'],
    count: doc.count,
    'percentile-25-sqm': doc['percentile-25-sqm'],
    'percentile-75-sqm': doc['percentile-75-sqm'],
    'total-area': doc['total-area'],
    'total-price': doc['total-price'],
    'median-price': doc['median-price'],
    'mean-price': doc['mean-price'],
    'percentile-25-price': doc['percentile-25-price'],
    'percentile-75-price': doc['percentile-75-price'],
  };
}

export function analysisDistrictMapper(doc: IAnalysisDoc<ObjectId, IDistrictStatsDoc>): IAnalysis<string, IDistrictStats> {
  return {
    _id: doc._id.toString(),
    start_date: doc.start_date,
    end_date: doc.end_date,
    analysis_type: doc.analysis_type,
    analysis_period: doc.analysis_period,
    analysis_version: doc.analysis_version,
    data: doc.data.map((statDoc) => districtStatsMapper(statDoc)),
  };
}
