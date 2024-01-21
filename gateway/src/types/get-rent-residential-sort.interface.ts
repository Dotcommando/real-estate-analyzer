import { AnalysisPeriod, AnalysisType } from '../constants';


export interface IStatSort {
  medianDelta?: -1 | 1;
  meanDelta?: -1 | 1;
  medianDeltaSqm?: -1 | 1;
  meanDeltaSqm?: -1 | 1;
  noDataAbsReason?: -1 | 1;
  noDataSqmReason?: -1 | 1;
}

export interface IGetRentResidentialSort {
  url?: -1 | 1;
  publish_date?: -1 | 1;
  source?: -1 | 1;
  city?: -1 | 1;
  district?: -1 | 1;
  price?: -1 | 1;
  ad_id?: -1 | 1;
  'online-viewing'?: -1 | 1;
  'postal-code'?: -1 | 1;
  condition?: -1 | 1;
  'energy-efficiency'?: -1 | 1;
  'construction-year'?: -1 | 1;
  floor?: -1 | 1;
  parking?: -1 | 1;
  'parking-places'?: -1 | 1;
  'property-area'?: -1 | 1;
  furnishing?: -1 | 1;
  bedrooms?: -1 | 1;
  bathrooms?: -1 | 1;
  'air-conditioning'?: -1 | 1;
  pets?: -1 | 1;
  alarm?: -1 | 1;
  attic?: -1 | 1;
  balcony?: -1 | 1;
  elevator?: -1 | 1;
  fireplace?: -1 | 1;
  garden?: -1 | 1;
  playroom?: -1 | 1;
  pool?: -1 | 1;
  storage?: -1 | 1;
  'ad_last_updated'?: -1 | 1;
  'updated_at'?: -1 | 1;
  'plot-area'?: -1 | 1;
  category?: -1 | 1;
  subcategory?: -1 | 1;
  activeDays?: -1 | 1;
  'price-sqm'?: -1 | 1;
  priceDeviations?: {
    [AnalysisType.CITY_AVG_MEAN]?: {
      [AnalysisPeriod.MONTHLY_TOTAL]?: IStatSort;
      [AnalysisPeriod.MONTHLY_INTERMEDIARY]?: IStatSort;
      [AnalysisPeriod.DAILY_TOTAL]?: IStatSort;
    };
    [AnalysisType.DISTRICT_AVG_MEAN]?: {
      [AnalysisPeriod.MONTHLY_TOTAL]?: IStatSort;
      [AnalysisPeriod.MONTHLY_INTERMEDIARY]?: IStatSort;
      [AnalysisPeriod.DAILY_TOTAL]?: IStatSort;
    };
  };
}
