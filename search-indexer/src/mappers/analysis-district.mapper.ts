import { ObjectId } from 'mongodb';

import { IAnalysis, IAnalysisDoc, IDistrictStats, IDistrictStatsDoc } from '../types';


export function districtStatsMapper(doc: IDistrictStatsDoc): IDistrictStats {
  return {
    city: doc.city,
    district: doc.district,
    'median-sqm': Math.round(doc['median-sqm'] * 100) / 100,
    'mean-sqm': Math.round(doc['mean-sqm'] * 100) / 100,
    count: doc.count,
    'percentile-25-sqm': Math.round(doc['percentile-25-sqm'] * 100) / 100,
    'percentile-75-sqm': Math.round(doc['percentile-75-sqm'] * 100) / 100,
    'total-area': doc['total-area'],
    'total-price': doc['total-price'],
    'median-price': Math.round(doc['median-price'] * 100) / 100,
    'mean-price': Math.round(doc['mean-price'] * 100) / 100,
    'percentile-25-price': Math.round(doc['percentile-25-price'] * 100) / 100,
    'percentile-75-price': Math.round(doc['percentile-75-price'] * 100) / 100,
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
