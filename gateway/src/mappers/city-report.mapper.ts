import { ICityStats, ICityStatsDoc } from '../types';


export function cityReportMapper<T extends Omit<ICityStatsDoc, '_id' | 'id'>>(docs: T[]): ICityStats[] {
  if (!docs.length) {
    return docs;
  }

  const processedDocs: ICityStats[] = [];

  for (const doc of docs) {
    processedDocs.push({
      city: doc.city,
      'total-area': doc['total-area'],
      'total-price': doc['total-price'],
      'mean-price': doc['mean-price'],
      'median-price': doc['median-price'],
      'price-percentile-25': doc['price-percentile-25'],
      'price-percentile-75': doc['price-percentile-75'],
      'mean-price-sqm': doc['mean-price-sqm'],
      'median-price-sqm': doc['median-price-sqm'],
    });
  }

  return processedDocs;
}
