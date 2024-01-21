import { processDistrict } from './process-district';

import { AnalysisPeriod, AnalysisType, NoStatisticsDataReason } from '../constants';
import { IAnalysis, ICityStats, IDistrictStats, IRentResidential, ISaleResidential } from '../types';


export const calculateDeltaPercent = (statValue: number, itemValue: number): number => {
  return Math.round((itemValue / statValue) * 10000) / 100;
};

const getCityStat = (cityName: string, cityStat: IAnalysis<string, ICityStats>): ICityStats | undefined => {
  try {
    const city = cityName.toLowerCase();

    return cityStat.data
      .find((stats: ICityStats) => stats.city.toLowerCase() === city);
  } catch (e) {
    return undefined;
  }
};

const getDistrictStat = (
  cityName: string,
  districtName: string,
  districtStat: IAnalysis<string, IDistrictStats>,
): IDistrictStats | undefined => {
  try {
    const city = cityName.toLowerCase();
    const district = districtName.toLowerCase();

    return districtStat.data
      .filter((stat: IDistrictStats) => stat.city.toLowerCase() === city)
      .find((stat: IDistrictStats) => stat.district.toLowerCase() === district);
  } catch (e) {
    return undefined;
  }
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
  const hasDistrict = Boolean(district);
  const hasPropertyArea = typeof item['property-area'] === 'number' && item['property-area'] > 0 && !isNaN(item['property-area']);

  const foundCityMonthlyTotalStat= Boolean(getCityStat(city, cityMonthlyTotalStat));
  const foundCityMonthlyIntermediaryStat= Boolean(getCityStat(city, cityMonthlyIntermediaryStat));
  const foundCityDailyTotalStat= Boolean(getCityStat(city, cityDailyTotalStat));

  const foundDistrictMonthlyTotalStat= Boolean(getDistrictStat(city, district, districtMonthlyTotalStat));
  const foundDistrictMonthlyIntermediaryStat= Boolean(getDistrictStat(city, district, districtMonthlyIntermediaryStat));
  const foundDistrictDailyTotalStat= Boolean(getDistrictStat(city, district, districtDailyTotalStat));

  const cityMonthlyTotalMeanDeltaSqm = hasPropertyArea
    ? foundCityMonthlyTotalStat
      ? calculateDeltaPercent(getCityMeanPriceSqm(city, cityMonthlyTotalStat), item['price-sqm'])
      : NaN
    : NaN;
  const cityMonthlyTotalMedianDeltaSqm = hasPropertyArea
    ? foundCityMonthlyTotalStat
      ? calculateDeltaPercent(getCityMedianPriceSqm(city, cityMonthlyTotalStat), item['price-sqm'])
      : NaN
    : NaN;
  const cityMonthlyIntermediaryMeanDeltaSqm = hasPropertyArea
    ? foundCityMonthlyIntermediaryStat
      ? calculateDeltaPercent(getCityMeanPriceSqm(city, cityMonthlyIntermediaryStat), item['price-sqm'])
      : NaN
    : NaN;
  const cityMonthlyIntermediaryMedianDeltaSqm = hasPropertyArea
    ? foundCityMonthlyIntermediaryStat
      ? calculateDeltaPercent(getCityMeanPriceSqm(city, cityMonthlyIntermediaryStat), item['price-sqm'])
      : NaN
    : NaN;
  const cityDailyTotalMeanDeltaSqm = hasPropertyArea
    ? foundCityDailyTotalStat
      ? calculateDeltaPercent(getCityMeanPriceSqm(city, cityDailyTotalStat), item['price-sqm'])
      : NaN
    : NaN;
  const cityDailyTotalMedianDeltaSqm = hasPropertyArea
    ? foundCityDailyTotalStat
      ? calculateDeltaPercent(getCityMeanPriceSqm(city, cityDailyTotalStat), item['price-sqm'])
      : NaN
    : NaN;

  const cityMonthlyTotalMeanDelta = foundCityMonthlyTotalStat
    ? calculateDeltaPercent(getCityMeanPrice(city, cityMonthlyTotalStat), item['price'])
    : NaN;
  const cityMonthlyTotalMedianDelta = foundCityMonthlyTotalStat
    ? calculateDeltaPercent(getCityMedianPrice(city, cityMonthlyTotalStat), item['price'])
    : NaN;
  const cityMonthlyIntermediaryMeanDelta = foundCityMonthlyIntermediaryStat
    ? calculateDeltaPercent(getCityMeanPrice(city, cityMonthlyIntermediaryStat), item['price'])
    : NaN;
  const cityMonthlyIntermediaryMedianDelta = foundCityMonthlyIntermediaryStat
    ? calculateDeltaPercent(getCityMeanPrice(city, cityMonthlyIntermediaryStat), item['price'])
    : NaN;
  const cityDailyTotalMeanDelta = foundCityDailyTotalStat
    ? calculateDeltaPercent(getCityMeanPrice(city, cityDailyTotalStat), item['price'])
    : NaN;
  const cityDailyTotalMedianDelta = foundCityDailyTotalStat
    ? calculateDeltaPercent(getCityMeanPrice(city, cityDailyTotalStat), item['price'])
    : NaN;

  const districtMonthlyTotalMeanDeltaSqm = hasPropertyArea
    ? hasDistrict
      ? foundDistrictMonthlyTotalStat
        ? calculateDeltaPercent(getDistrictMeanPriceSqm(city, district, districtMonthlyTotalStat), item['price-sqm'])
        : NaN
      : NaN
    : NaN;
  const districtMonthlyTotalMedianDeltaSqm = hasPropertyArea
    ? hasDistrict
      ? foundDistrictMonthlyTotalStat
        ? calculateDeltaPercent(getDistrictMedianPriceSqm(city, district, districtMonthlyTotalStat), item['price-sqm'])
        : NaN
      : NaN
    : NaN;
  const districtMonthlyIntermediaryMeanDeltaSqm = hasPropertyArea
    ? hasDistrict
      ? foundDistrictMonthlyIntermediaryStat
        ? calculateDeltaPercent(getDistrictMeanPriceSqm(city, district, districtMonthlyIntermediaryStat), item['price-sqm'])
        : NaN
      : NaN
    : NaN;
  const districtMonthlyIntermediaryMedianDeltaSqm = hasPropertyArea
    ? hasDistrict
      ? foundDistrictMonthlyIntermediaryStat
        ? calculateDeltaPercent(getDistrictMedianPriceSqm(city, district, districtMonthlyIntermediaryStat), item['price-sqm'])
        : NaN
      : NaN
    : NaN;
  const districtDailyTotalMeanDeltaSqm = hasPropertyArea
    ? hasDistrict
      ? foundDistrictDailyTotalStat
        ? calculateDeltaPercent(getDistrictMeanPriceSqm(city, district, districtDailyTotalStat), item['price-sqm'])
        : NaN
      : NaN
    : NaN;
  const districtDailyTotalMedianDeltaSqm = hasPropertyArea
    ? hasDistrict
      ? foundDistrictDailyTotalStat
        ? calculateDeltaPercent(getDistrictMedianPriceSqm(city, district, districtDailyTotalStat), item['price-sqm'])
        : NaN
      : NaN
    : NaN;

  const districtMonthlyTotalMeanDelta = hasDistrict
    ? foundDistrictMonthlyTotalStat
      ? calculateDeltaPercent(getDistrictMeanPrice(city, district, districtMonthlyTotalStat), item['price'])
      : NaN
    : NaN;
  const districtMonthlyTotalMedianDelta = hasDistrict
    ? foundDistrictMonthlyTotalStat
      ? calculateDeltaPercent(getDistrictMedianPrice(city, district, districtMonthlyTotalStat), item['price'])
      : NaN
    : NaN;
  const districtMonthlyIntermediaryMeanDelta = hasDistrict
    ? foundDistrictMonthlyIntermediaryStat
      ? calculateDeltaPercent(getDistrictMeanPrice(city, district, districtMonthlyIntermediaryStat), item['price'])
      : NaN
    : NaN;
  const districtMonthlyIntermediaryMedianDelta = hasDistrict
    ? foundDistrictMonthlyIntermediaryStat
      ? calculateDeltaPercent(getDistrictMedianPrice(city, district, districtMonthlyIntermediaryStat), item['price'])
      : NaN
    : NaN;
  const districtDailyTotalMeanDelta = hasDistrict
    ? foundDistrictDailyTotalStat
      ? calculateDeltaPercent(getDistrictMeanPrice(city, district, districtDailyTotalStat), item['price'])
      : NaN
    : NaN;
  const districtDailyTotalMedianDelta = hasDistrict
    ? foundDistrictDailyTotalStat
      ? calculateDeltaPercent(getDistrictMedianPrice(city, district, districtDailyTotalStat), item['price'])
      : NaN
    : NaN;

  return {
    ...item,
    priceDeviations: {
      [AnalysisType.CITY_AVG_MEAN]: {
        [AnalysisPeriod.MONTHLY_TOTAL]: {
          ...(!isNaN(cityMonthlyTotalMeanDeltaSqm) && { meanDeltaSqm: cityMonthlyTotalMeanDeltaSqm }),
          ...(!isNaN(cityMonthlyTotalMedianDeltaSqm) && { medianDeltaSqm: cityMonthlyTotalMedianDeltaSqm }),
          ...(!isNaN(cityMonthlyTotalMeanDelta) && { meanDelta: cityMonthlyTotalMeanDelta }),
          ...(!isNaN(cityMonthlyTotalMedianDelta) && { medianDelta: cityMonthlyTotalMedianDelta }),
          ...(!foundCityMonthlyTotalStat && { noDataAbsReason: NoStatisticsDataReason.NO_CITY_STAT_FOUND }),
          ...(!hasPropertyArea && { noDataSqmReason: NoStatisticsDataReason.NO_PROPERTY_AREA }),
        },
        [AnalysisPeriod.MONTHLY_INTERMEDIARY]: {
          ...(!isNaN(cityMonthlyIntermediaryMeanDeltaSqm) && { meanDeltaSqm: cityMonthlyIntermediaryMeanDeltaSqm }),
          ...(!isNaN(cityMonthlyIntermediaryMedianDeltaSqm) && { medianDeltaSqm: cityMonthlyIntermediaryMedianDeltaSqm }),
          ...(!isNaN(cityMonthlyIntermediaryMeanDelta) && { meanDelta: cityMonthlyIntermediaryMeanDelta }),
          ...(!isNaN(cityMonthlyIntermediaryMedianDelta) && { medianDelta: cityMonthlyIntermediaryMedianDelta }),
          ...(!foundCityMonthlyIntermediaryStat && { noDataAbsReason: NoStatisticsDataReason.NO_CITY_STAT_FOUND }),
          ...(!hasPropertyArea && { noDataSqmReason: NoStatisticsDataReason.NO_PROPERTY_AREA }),
        },
        [AnalysisPeriod.DAILY_TOTAL]: {
          ...(!isNaN(cityDailyTotalMeanDeltaSqm) && { meanDeltaSqm: cityDailyTotalMeanDeltaSqm }),
          ...(!isNaN(cityDailyTotalMedianDeltaSqm) && { medianDeltaSqm: cityDailyTotalMedianDeltaSqm }),
          ...(!isNaN(cityDailyTotalMeanDelta) && { meanDelta: cityDailyTotalMeanDelta }),
          ...(!isNaN(cityDailyTotalMedianDelta) && { medianDelta: cityDailyTotalMedianDelta }),
          ...(!foundCityDailyTotalStat && { noDataAbsReason: NoStatisticsDataReason.NO_CITY_STAT_FOUND }),
          ...(!hasPropertyArea && { noDataSqmReason: NoStatisticsDataReason.NO_PROPERTY_AREA }),
        },
      },
      [AnalysisType.DISTRICT_AVG_MEAN]: {
        [AnalysisPeriod.MONTHLY_TOTAL]: {
          ...(!isNaN(districtMonthlyTotalMeanDeltaSqm) && { meanDeltaSqm: districtMonthlyTotalMeanDeltaSqm }),
          ...(!isNaN(districtMonthlyTotalMedianDeltaSqm) && { medianDeltaSqm: districtMonthlyTotalMedianDeltaSqm }),
          ...(!isNaN(districtMonthlyTotalMeanDelta) && { meanDelta: districtMonthlyTotalMeanDelta }),
          ...(!isNaN(districtMonthlyTotalMedianDelta) && { medianDelta: districtMonthlyTotalMedianDelta }),
          ...(!foundDistrictMonthlyTotalStat && { noDataSqmReason: NoStatisticsDataReason.NO_DISTRICT_STAT_FOUND }),
          ...(!hasPropertyArea && { noDataSqmReason: NoStatisticsDataReason.NO_PROPERTY_AREA }),
          ...(!hasDistrict && { noDataSqmReason: NoStatisticsDataReason.NO_DISTRICT }),
        },
        [AnalysisPeriod.MONTHLY_INTERMEDIARY]: {
          ...(!isNaN(districtMonthlyIntermediaryMeanDeltaSqm) && { meanDeltaSqm: districtMonthlyIntermediaryMeanDeltaSqm }),
          ...(!isNaN(districtMonthlyIntermediaryMedianDeltaSqm) && { medianDeltaSqm: districtMonthlyIntermediaryMedianDeltaSqm }),
          ...(!isNaN(districtMonthlyIntermediaryMeanDelta) && { meanDelta: districtMonthlyIntermediaryMeanDelta }),
          ...(!isNaN(districtMonthlyIntermediaryMedianDelta) && { medianDelta: districtMonthlyIntermediaryMedianDelta }),
          ...(!foundDistrictMonthlyIntermediaryStat && { noDataSqmReason: NoStatisticsDataReason.NO_DISTRICT_STAT_FOUND }),
          ...(!hasPropertyArea && { noDataSqmReason: NoStatisticsDataReason.NO_PROPERTY_AREA }),
          ...(!hasDistrict && { noDataSqmReason: NoStatisticsDataReason.NO_DISTRICT }),
        },
        [AnalysisPeriod.DAILY_TOTAL]: {
          ...(!isNaN(districtDailyTotalMeanDeltaSqm) && { meanDeltaSqm: districtDailyTotalMeanDeltaSqm }),
          ...(!isNaN(districtDailyTotalMedianDeltaSqm) && { medianDeltaSqm: districtDailyTotalMedianDeltaSqm }),
          ...(!isNaN(districtDailyTotalMeanDelta) && { meanDelta: districtDailyTotalMeanDelta }),
          ...(!isNaN(districtDailyTotalMedianDelta) && { medianDelta: districtDailyTotalMedianDelta }),
          ...(!foundDistrictDailyTotalStat && { noDataSqmReason: NoStatisticsDataReason.NO_DISTRICT_STAT_FOUND }),
          ...(!hasPropertyArea && { noDataSqmReason: NoStatisticsDataReason.NO_PROPERTY_AREA }),
          ...(!hasDistrict && { noDataSqmReason: NoStatisticsDataReason.NO_DISTRICT }),
        },
      },
    },
  };
}
