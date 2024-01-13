import { ObjectId } from 'mongodb';

import { IAnalysis, IAnalysisDoc, ICityStats, ICityStatsDoc } from '../types';


export function cityStatsMapper(doc: ICityStatsDoc): ICityStats {
  return {
    city: doc.city,
    'total-area': doc['total-area'],
    'total-price': doc['total-price'],
    'mean-price': Math.round(doc['mean-price'] * 100) / 100,
    'median-price': doc['median-price'],
    'price-percentile-25': Math.round(doc['price-percentile-25'] * 100) / 100,
    'price-percentile-75': Math.round(doc['price-percentile-75'] * 100) / 100,
    'mean-price-sqm': Math.round(doc['mean-price-sqm'] * 100) / 100,
    'median-price-sqm': Math.round(doc['median-price-sqm'] * 100) / 100,
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
