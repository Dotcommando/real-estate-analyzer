import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

import { AnyObject, CacheService } from './cache.service';
import { DbAccessService } from './db-access.service';

import { AnalysisPeriod, AnalysisType, Categories, LOGGER } from '../constants';
import {
  IAnalysis,
  IAsyncArrayIterator,
  ICityStats,
  IDistrictStats,
  IRentResidential,
  ISaleResidential,
  ISearchIndexConfig,
} from '../types';
import {
  analysisCityMapper,
  analysisDistrictMapper,
  calculatePriceDeviations,
  getArrayIterator,
  getIntFromEnv,
  mapAdDocToSearchResult,
  roundDate,
} from '../utils';


@Injectable()
export class SearchEngineService {
  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly cacheManager: CacheService,
    private readonly dbAccessService: DbAccessService,
  ) {
  }

  private processDocsPerOneTime = getIntFromEnv('SEARCH_INDEX_CONFIG', 20);
  private searchIndexConfig: ISearchIndexConfig[] = JSON.parse(this.configService.get('SEARCH_INDEX_CONFIG'));

  private getSearchResultModelByCollectionName(collectionName: string): Model<any> {
    for (const configEntry of this.searchIndexConfig) {
      if (configEntry.collections.includes(collectionName)) {
        return this.dbAccessService.getSearchResultsModelByCollection(configEntry.mapTo);
      }
    }

    throw new Error(`Cannot find search result Model by ad collection name: '${collectionName}'.`);
  }

  private async getStats<T>(
    adCollectionName: string,
    date: Date,
    analysisPeriod: AnalysisPeriod,
    analysisType: AnalysisType,
    mapperFunction: (doc: any) => IAnalysis<string, T>,
  ): Promise<IAnalysis<string, T> | null> {
    if (date.getDate() === 1 && analysisPeriod === AnalysisPeriod.MONTHLY_INTERMEDIARY) {
      const previousMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);

      return this.getStats(adCollectionName, previousMonth, AnalysisPeriod.MONTHLY_TOTAL, analysisType, mapperFunction);
    }

    const cacheKey = `${roundDate(date).toLocaleString()}_${adCollectionName}_${analysisType}_${analysisPeriod}`;
    const fromCache = this.cacheManager.getRawObject<IAnalysis<string, T>>(cacheKey);

    if (fromCache) {
      return fromCache;
    }

    const analysisCollectionName = this.dbAccessService.getRelatedAnalysisCollection(adCollectionName);
    const analysisModel = this.dbAccessService
      .getAnalysisModelByCollection(analysisCollectionName, analysisType);

    const startDate = analysisPeriod === AnalysisPeriod.MONTHLY_TOTAL
      ? roundDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))
      : analysisPeriod === AnalysisPeriod.MONTHLY_INTERMEDIARY
        ? roundDate(new Date(date.getFullYear(), date.getMonth(), 1))
        : roundDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1));
    const endDate = analysisPeriod === AnalysisPeriod.MONTHLY_TOTAL
      ? roundDate(new Date(date.getFullYear(), date.getMonth(), 0))
      : roundDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1));

    endDate.setUTCHours(23);
    endDate.setUTCMinutes(59, 59);

    const statDoc = await analysisModel
      .findOne({
        $and: [
          { analysis_period: analysisPeriod },
          { analysis_type: analysisType },
          { start_date: { $eq: startDate }},
          { end_date: { $eq: endDate }},
        ],
      })
      .exec();

    if (statDoc) {
      const mappedResult = mapperFunction(statDoc);

      await this.cacheManager.setRawObject(cacheKey, mappedResult as unknown as AnyObject);

      return mappedResult;
    }

    return null;
  }

  public async addNewDocs(fromAdCollectionName: string, toSearchCollectionName: string): Promise<void> {
    try {
      const adModel = this.dbAccessService.getModelByCollection(fromAdCollectionName);
      const currentRoundedDate = roundDate(new Date());
      const districtMonthlyTotalStat: IAnalysis<string, IDistrictStats> = await this.getStats<IDistrictStats>(
        fromAdCollectionName,
        currentRoundedDate,
        AnalysisPeriod.MONTHLY_TOTAL,
        AnalysisType.DISTRICT_AVG_MEAN,
        analysisDistrictMapper,
      );

      const districtMonthlyIntermediaryStat: IAnalysis<string, IDistrictStats> = await this.getStats<IDistrictStats>(
        fromAdCollectionName,
        currentRoundedDate,
        AnalysisPeriod.MONTHLY_INTERMEDIARY,
        AnalysisType.DISTRICT_AVG_MEAN,
        analysisDistrictMapper,
      );

      const districtDailyTotalStat: IAnalysis<string, IDistrictStats> = await this.getStats<IDistrictStats>(
        fromAdCollectionName,
        currentRoundedDate,
        AnalysisPeriod.DAILY_TOTAL,
        AnalysisType.DISTRICT_AVG_MEAN,
        analysisDistrictMapper,
      );

      const cityMonthlyTotalStat: IAnalysis<string, ICityStats> = await this.getStats<ICityStats>(
        fromAdCollectionName,
        currentRoundedDate,
        AnalysisPeriod.MONTHLY_TOTAL,
        AnalysisType.CITY_AVG_MEAN,
        analysisCityMapper,
      );

      const cityMonthlyIntermediaryStat: IAnalysis<string, ICityStats> = await this.getStats<ICityStats>(
        fromAdCollectionName,
        currentRoundedDate,
        AnalysisPeriod.MONTHLY_INTERMEDIARY,
        AnalysisType.CITY_AVG_MEAN,
        analysisCityMapper,
      );

      const cityDailyTotalStat: IAnalysis<string, ICityStats> = await this.getStats<ICityStats>(
        fromAdCollectionName,
        currentRoundedDate,
        AnalysisPeriod.DAILY_TOTAL,
        AnalysisType.CITY_AVG_MEAN,
        analysisCityMapper,
      );

      this.checkStats(
        districtMonthlyTotalStat,
        districtMonthlyIntermediaryStat,
        districtDailyTotalStat,
        cityMonthlyTotalStat,
        cityMonthlyIntermediaryStat,
        cityDailyTotalStat,
      );

      const searchResultModel = this.getSearchResultModelByCollectionName(fromAdCollectionName);

      // console.log('');
      // console.log('');
      // console.log('');
      // console.log(fromAdCollectionName);
      // console.log('');
      // console.log('districtMonthlyTotalStat:');
      // console.log({ ...districtMonthlyTotalStat, data: [ districtMonthlyTotalStat.data[0], districtMonthlyTotalStat.data[1], districtMonthlyTotalStat.data[2], '...' ]});
      // console.log('');
      // console.log('districtMonthlyIntermediaryStat:');
      // console.log({ ...districtMonthlyIntermediaryStat, data: [ districtMonthlyIntermediaryStat.data[0], districtMonthlyIntermediaryStat.data[1], districtMonthlyIntermediaryStat.data[2], '...' ]});
      // console.log('');
      // console.log('districtDailyTotalStat');
      // console.log({ ...districtDailyTotalStat, data: [ districtDailyTotalStat.data[0], districtDailyTotalStat.data[1], districtDailyTotalStat.data[2], '...' ]});
      // console.log('');
      // console.log('cityMonthlyTotalStat');
      // console.log({ ...cityMonthlyTotalStat, data: [ cityMonthlyTotalStat.data[0], cityMonthlyTotalStat.data[1], cityMonthlyTotalStat.data[2], '...' ]});
      // console.log('');
      // console.log('cityMonthlyIntermediaryStat');
      // console.log({ ...cityMonthlyIntermediaryStat, data: [ cityMonthlyIntermediaryStat.data[0], cityMonthlyIntermediaryStat.data[1], cityMonthlyIntermediaryStat.data[2], '...' ]});
      // console.log('');
      // console.log('cityDailyTotalStat');
      // console.log({ ...cityDailyTotalStat, data: [ cityDailyTotalStat.data[0], cityDailyTotalStat.data[1], cityDailyTotalStat.data[2], '...' ]});

      const cachedObjectIds: ObjectId[] = this.cacheManager
        .getKeysFilteredBy((key: string): boolean => ObjectId.isValid(key.replace(fromAdCollectionName + '_', '')))
        .map((objectId: string): string => objectId.replace(fromAdCollectionName + '_', ''))
        .map((objectId: string): ObjectId => new ObjectId(objectId));
      const filter = {
        _id: { $nin: cachedObjectIds },
        updated_at: { $gt: currentRoundedDate },
        // active_dates: { $elemMatch: { $eq: currentRoundedDate }},
      };
      const docsToProcess = await adModel
        .countDocuments(filter)
        .exec();

      console.log('docsToProcess: ', fromAdCollectionName, docsToProcess);

      // const steps = Math.ceil(docsToProcess / this.processDocsPerOneTime);
      const steps = 1;

      console.log('steps: ', docsToProcess / this.processDocsPerOneTime);

      const stepsArray = Array.from({ length: steps }, (_, index) => index);
      const stepsIterator: IAsyncArrayIterator<number> = getArrayIterator(stepsArray);
      const lowerCasedAdCollectionName = fromAdCollectionName.toLowerCase();
      const category: Categories = lowerCasedAdCollectionName.includes('houses')
        ? Categories.Houses
        : lowerCasedAdCollectionName.includes('apartments')
          ? Categories.Apartments
          : lowerCasedAdCollectionName.includes('plots')
            ? Categories.Plots
            : Categories.Commercial;

      for await (const step of stepsIterator) {
        const docsForTransferToSearchResults = await adModel
          .find(filter)
          .limit(this.processDocsPerOneTime)
          .exec();

        const itemsForIndex: Array<Omit<IRentResidential | ISaleResidential, 'priceDeviations'>> = docsForTransferToSearchResults
          .filter((doc) => doc.price > 0 && doc['property-area'] > 1)
          .filter((doc) => Boolean(doc.district))
          .map((doc) => mapAdDocToSearchResult(doc, category));

        const itemsForIndexDocs = itemsForIndex
          .map((item): IRentResidential | ISaleResidential => calculatePriceDeviations(
            item,
            districtMonthlyTotalStat,
            districtMonthlyIntermediaryStat,
            districtDailyTotalStat,
            cityMonthlyTotalStat,
            cityMonthlyIntermediaryStat,
            cityDailyTotalStat,
          ));

        for (const item of itemsForIndexDocs) {
          console.log('');
          console.log(item);
        }
      }

    } catch (e) {
      this.logger.error(`Cannot add new documents from '${fromAdCollectionName}' to '${toSearchCollectionName}'.`);
      this.logger.error(e);
    }
  }

  private checkStats(
    districtMonthlyTotalStat: IAnalysis<string, IDistrictStats> | null,
    districtMonthlyIntermediaryStat: IAnalysis<string, IDistrictStats> | null,
    districtDailyTotalStat: IAnalysis<string, IDistrictStats> | null,
    cityMonthlyTotalStat: IAnalysis<string, ICityStats> | null,
    cityMonthlyIntermediaryStat: IAnalysis<string, ICityStats> | null,
    cityDailyTotalStat: IAnalysis<string, ICityStats> | null,
  ): void {
    if (!districtMonthlyTotalStat) {
      throw new Error('\'districtMonthlyTotalStat\' is empty. Cannot proceed calculations.');
    }

    if (!districtMonthlyIntermediaryStat) {
      throw new Error('\'districtMonthlyIntermediaryStat\' is empty. Cannot proceed calculations.');
    }

    if (!districtDailyTotalStat) {
      throw new Error('\'districtDailyTotalStat\' is empty. Cannot proceed calculations.');
    }

    if (!cityMonthlyTotalStat) {
      throw new Error('\'cityMonthlyTotalStat\' is empty. Cannot proceed calculations.');
    }

    if (!cityMonthlyIntermediaryStat) {
      throw new Error('\'cityMonthlyIntermediaryStat\' is empty. Cannot proceed calculations.');
    }

    if (!cityDailyTotalStat) {
      throw new Error('\'cityDailyTotalStat\' is empty. Cannot proceed calculations.');
    }
  }
}
