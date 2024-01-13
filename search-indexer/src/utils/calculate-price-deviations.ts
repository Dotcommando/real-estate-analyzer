import { processDistrict } from './process-district';

import { AnalysisPeriod, AnalysisType } from '../constants';
import { IAnalysis, ICityStats, IDistrictStats, IRentResidential, ISaleResidential } from '../types';


export const calculateDeltaPercent = (statValue: number, itemValue: number): number => {
  return Math.round((itemValue / statValue) * 10000) / 100;
};

const getCityStat = (cityName: string, cityStat: IAnalysis<string, ICityStats>): ICityStats | undefined => {
  const city = cityName.toLowerCase();

  return cityStat.data
    .find((stats: ICityStats) => stats.city.toLowerCase() === city);
};

const getDistrictStat = (
  cityName: string,
  districtName: string,
  districtStat: IAnalysis<string, IDistrictStats>,
): IDistrictStats | undefined => {
  const city = cityName.toLowerCase();
  const district = districtName.toLowerCase();

  return districtStat.data
    .filter((stat: IDistrictStats) => stat.city.toLowerCase() === city)
    .find((stat: IDistrictStats) => stat.district.toLowerCase() === district);
};

const getKeyFromStat = <T>(
  stat: T,
  key: keyof T,
): number => {
  return stat
    ? stat[key] as number
    : NaN;
};

const getCityMeanPrice = (cityName: string, cityStat: IAnalysis<string, ICityStats>): number =>
  getKeyFromStat(getCityStat(cityName, cityStat), 'mean-price');

const getCityMeanPriceSqm = (cityName: string, cityStat: IAnalysis<string, ICityStats>): number =>
  getKeyFromStat(getCityStat(cityName, cityStat), 'mean-price-sqm');

const getCityMedianPrice = (cityName: string, cityStat: IAnalysis<string, ICityStats>): number =>
  getKeyFromStat(getCityStat(cityName, cityStat), 'median-price');

const getCityMedianPriceSqm = (cityName: string, cityStat: IAnalysis<string, ICityStats>): number =>
  getKeyFromStat(getCityStat(cityName, cityStat), 'median-price-sqm');

const getDistrictMeanPrice = (cityName: string, districtName: string, districtStat: IAnalysis<string, IDistrictStats>): number =>
  getKeyFromStat(getDistrictStat(cityName, districtName, districtStat), 'mean-price');

const getDistrictMeanPriceSqm = (cityName: string, districtName: string, districtStat: IAnalysis<string, IDistrictStats>): number =>
  getKeyFromStat(getDistrictStat(cityName, districtName, districtStat), 'mean-sqm');

const getDistrictMedianPrice = (cityName: string, districtName: string, districtStat: IAnalysis<string, IDistrictStats>): number =>
  getKeyFromStat(getDistrictStat(cityName, districtName, districtStat), 'median-price');

const getDistrictMedianPriceSqm = (cityName: string, districtName: string, districtStat: IAnalysis<string, IDistrictStats>): number =>
  getKeyFromStat(getDistrictStat(cityName, districtName, districtStat), 'median-sqm');

export function calculatePriceDeviations<TObjectId>(
  item: Omit<IRentResidential | ISaleResidential, 'priceDeviations'> & { _id: TObjectId },
  districtMonthlyTotalStat: IAnalysis<string, IDistrictStats>,
  districtMonthlyIntermediaryStat: IAnalysis<string, IDistrictStats>,
  districtDailyTotalStat: IAnalysis<string, IDistrictStats>,
  cityMonthlyTotalStat: IAnalysis<string, ICityStats>,
  cityMonthlyIntermediaryStat: IAnalysis<string, ICityStats>,
  cityDailyTotalStat: IAnalysis<string, ICityStats>,
): (IRentResidential | ISaleResidential) & { _id: TObjectId } {
  const city = item.city;
  const district = processDistrict(item.district);

  return {
    ...item,
    priceDeviations: {
      [AnalysisType.CITY_AVG_MEAN]: {
        [AnalysisPeriod.MONTHLY_TOTAL]: {
          meanDelta: calculateDeltaPercent(getCityMeanPriceSqm(city, cityMonthlyTotalStat), item['price-sqm']),
          medianDelta: calculateDeltaPercent(getCityMedianPriceSqm(city, cityMonthlyTotalStat), item['price-sqm']),
        },
        [AnalysisPeriod.MONTHLY_INTERMEDIARY]: {
          meanDelta: calculateDeltaPercent(getCityMeanPriceSqm(city, cityMonthlyIntermediaryStat), item['price-sqm']),
          medianDelta: calculateDeltaPercent(getCityMeanPriceSqm(city, cityMonthlyIntermediaryStat), item['price-sqm']),
        },
        [AnalysisPeriod.DAILY_TOTAL]: {
          meanDelta: calculateDeltaPercent(getCityMeanPriceSqm(city, cityDailyTotalStat), item['price-sqm']),
          medianDelta: calculateDeltaPercent(getCityMeanPriceSqm(city, cityDailyTotalStat), item['price-sqm']),
        },
      },
      [AnalysisType.DISTRICT_AVG_MEAN]: {
        [AnalysisPeriod.MONTHLY_TOTAL]: {
          meanDelta: calculateDeltaPercent(getDistrictMeanPriceSqm(city, district, districtMonthlyTotalStat), item['price-sqm']),
          medianDelta: calculateDeltaPercent(getDistrictMedianPriceSqm(city, district, districtMonthlyTotalStat), item['price-sqm']),
        },
        [AnalysisPeriod.MONTHLY_INTERMEDIARY]: {
          meanDelta: calculateDeltaPercent(getDistrictMeanPriceSqm(city, district, districtMonthlyIntermediaryStat), item['price-sqm']),
          medianDelta: calculateDeltaPercent(getDistrictMedianPriceSqm(city, district, districtMonthlyIntermediaryStat), item['price-sqm']),
        },
        [AnalysisPeriod.DAILY_TOTAL]: {
          meanDelta: calculateDeltaPercent(getDistrictMeanPriceSqm(city, district, districtDailyTotalStat), item['price-sqm']),
          medianDelta: calculateDeltaPercent(getDistrictMedianPriceSqm(city, district, districtDailyTotalStat), item['price-sqm']),
        },
      },
    },
  };
}
