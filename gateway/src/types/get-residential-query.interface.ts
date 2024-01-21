import { AG_MayBeArray, AG_MayBeRange } from './aggregation.type';

import {
  AirConditioning,
  AnalysisPeriod,
  AnalysisType,
  Categories,
  Condition,
  EnergyEfficiency,
  Furnishing,
  NoStatisticsDataReason,
  OnlineViewing,
  Parking,
  Pets,
  PoolType,
  Source,
  StandardSet,
} from '../constants';


export interface IStatFilter {
  medianDelta?: AG_MayBeRange<number>;
  meanDelta?: AG_MayBeRange<number>;
  medianDeltaSqm?: AG_MayBeRange<number>;
  meanDeltaSqm?: AG_MayBeRange<number>;
  noDataAbsReason?: AG_MayBeArray<NoStatisticsDataReason>;
  noDataSqmReason?: AG_MayBeArray<NoStatisticsDataReason>;
}

export interface IGetRentResidentialQuery {
  url?: AG_MayBeArray<string>;
  publish_date?: AG_MayBeRange<Date>;
  source?: AG_MayBeArray<Source>;
  city?: AG_MayBeArray<string>;
  district?: AG_MayBeArray<string>;
  price?: AG_MayBeRange<number>;
  ad_id?: AG_MayBeArray<string>;
  'online-viewing'?: AG_MayBeArray<OnlineViewing>;
  'postal-code'?: AG_MayBeArray<string>;
  condition?: AG_MayBeArray<Condition>;
  'energy-efficiency'?: AG_MayBeArray<EnergyEfficiency>;
  'construction-year'?: AG_MayBeArray<string>;
  floor?: AG_MayBeArray<string>;
  parking?: AG_MayBeArray<Parking>;
  'parking-places'?: AG_MayBeRange<number>;
  'property-area'?: AG_MayBeRange<number>;
  furnishing?: AG_MayBeArray<Furnishing>;
  bedrooms?: AG_MayBeRange<number>;
  bathrooms?: AG_MayBeRange<number>;
  'air-conditioning'?: AG_MayBeArray<AirConditioning>;
  pets?: AG_MayBeArray<Pets>;
  alarm?: AG_MayBeArray<StandardSet>;
  attic?: AG_MayBeArray<StandardSet>;
  balcony?: AG_MayBeArray<StandardSet>;
  elevator?: AG_MayBeArray<StandardSet>;
  fireplace?: AG_MayBeArray<StandardSet>;
  garden?: AG_MayBeArray<StandardSet>;
  playroom?: AG_MayBeArray<StandardSet>;
  pool?: AG_MayBeArray<PoolType>;
  storage?: AG_MayBeArray<StandardSet>;
  'ad_last_updated'?: AG_MayBeRange<Date>;
  'updated_at'?: AG_MayBeRange<Date>;
  'plot-area'?: AG_MayBeRange<number>;
  category?: AG_MayBeArray<Categories>;
  subcategory?: AG_MayBeArray<string>;
  activeDays?: AG_MayBeRange<number>;
  'price-sqm'?: AG_MayBeRange<number>;
  priceDeviations?: {
    [AnalysisType.CITY_AVG_MEAN]?: {
      [AnalysisPeriod.MONTHLY_TOTAL]?: IStatFilter;
      [AnalysisPeriod.MONTHLY_INTERMEDIARY]?: IStatFilter;
      [AnalysisPeriod.DAILY_TOTAL]?: IStatFilter;
    };
    [AnalysisType.DISTRICT_AVG_MEAN]?: {
      [AnalysisPeriod.MONTHLY_TOTAL]?: IStatFilter;
      [AnalysisPeriod.MONTHLY_INTERMEDIARY]?: IStatFilter;
      [AnalysisPeriod.DAILY_TOTAL]?: IStatFilter;
    };
  };
}

export interface IGetSaleResidentialQuery extends Omit<IGetRentResidentialQuery, 'pets' | 'plot-area'> {
}
