import { IDistrictStats, IDistrictStatsDoc } from '../types';


export function districtReportMapper<T extends Omit<IDistrictStatsDoc, '_id' | 'id'>>(docs: T[]): IDistrictStats[] {
  if (!docs.length) {
    return docs;
  }

  const processedDocs: IDistrictStats[] = [];

  for (const doc of docs) {
    processedDocs.push({
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
    });
  }

  return processedDocs;
}
