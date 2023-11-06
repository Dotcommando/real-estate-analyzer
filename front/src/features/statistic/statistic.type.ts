export enum AnalysisType {
  CITY_AVG_MEAN = 'city_avg_mean',
  DISTRICT_AVG_MEAN = 'district_avg_mean',
}

export enum AnalysisPeriod {
  DAILY_INTERMEDIARY = 'daily_intermediary',
  DAILY_TOTAL = 'daily_total',
  MONTHLY_INTERMEDIARY = 'monthly_intermediary',
  MONTHLY_TOTAL = 'monthly_total',
}

export enum AdsEnum {
  RentFlats = 'rentapartmentsflats',
  RentHouses = 'renthouses',
  SaleFlats = 'saleapartmentsflats',
  SaleHouses = 'salehouses',
}

export type StatisticDataResponse = {
  'city': string;
  'district': string;
  'count': number;
  'total-area': number;
  'total-price': number;
  'mean-price': number;
  'median-price': number;
  'price-percentile-25': number;
  'price-percentile-75': number;
  'mean-price-sqm': number;
  'median-price-sqm': number;
};

export type StatisticGetParameters = {
  startDate: string;
  endDate: string;
  analysisType: AnalysisType;
  analysisPeriod: AnalysisPeriod;
  ads: AdsEnum;
};

export type StatisticResponse = {
  startDate: string;
  endDate: string;
  analysisType: AnalysisType;
  analysisPeriod: AnalysisPeriod;
  data: StatisticDataResponse[];
};

export type NormalizedStatistic = Record<string, StatisticDataResponse>;
