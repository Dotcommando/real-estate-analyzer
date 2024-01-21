import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

import { AnyObject, CacheService } from './cache.service';
import { DbAccessService } from './db-access.service';

import {
  AnalysisPeriod,
  AnalysisType,
  Categories,
  LOGGER,
  MINUTE_MS,
} from '../constants';
import {
  adDocToSearchResultMapper,
  analysisCityMapper,
  analysisDistrictMapper,
} from '../mappers';
import {
  IAnalysis,
  IAsyncArrayIterator,
  ICityStats,
  IDistrictStats,
  IRentResidential,
  ISaleResidential,
  ISearchIndexConfig,
  LaunchSettings,
  LaunchSettingsWithFirstRunFromDayStart,
  LaunchSettingsWithFirstRunPast,
} from '../types';
import {
  calculatePriceDeviations,
  convertTimeToMilliseconds,
  getArrayIterator,
  getIntFromEnv,
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

  private processDocsPerOneTime = getIntFromEnv('PROCESS_DOCS_PER_ONE_TIME', 20);
  private searchIndexConfig: ISearchIndexConfig[] = JSON.parse(this.configService.get('SEARCH_INDEX_CONFIG'));

  private parseCronPattern(cronPattern: string): { interval: number; offsets: number[] } {
    const minutesPart = cronPattern.split(' ')[0];
    let interval = 60; // default
    let offsets = [];

    if (minutesPart.includes('/')) {
      const parts = minutesPart.split('/');

      interval = parseInt(parts[1]);

      // range "2-59"
      if (parts[0].includes('-')) {
        const range = parts[0].split('-').map(Number);

        for (let i = range[0]; i <= range[1]; i += interval) {
          offsets.push(i);
        }
      } else { // "*/4"
        for (let i = 0; i < 60; i += interval) {
          offsets.push(i);
        }
      }
    } else if (minutesPart !== '*') { // "25"
      offsets = minutesPart.split(',').map(Number);
      offsets.sort((a, b) => a - b);
    }

    return { interval, offsets };
  }

  public calculateLastExecutionTimestamp(cronPattern: string, currentTime: Date): number {
    const { offsets } = this.parseCronPattern(cronPattern);
    const currentMinute = currentTime.getMinutes();
    const currentHour = currentTime.getHours();

    let lastExecutionMinute = offsets.slice().reverse().find(offset => currentMinute > offset);

    if (lastExecutionMinute === undefined) {
      lastExecutionMinute = offsets[offsets.length - 1];
      currentTime.setHours(currentHour - 1);
    }

    const lastExecutionTime = new Date(currentTime);

    lastExecutionTime.setMinutes(lastExecutionMinute, 0, 0);

    return lastExecutionTime.getTime();
  }

  private getSearchResultModelByAdCollectionName(collectionName: string): Model<any> {
    for (const configEntry of this.searchIndexConfig) {
      if (configEntry.collections.includes(collectionName)) {
        return this.dbAccessService.getSearchResultsModelByCollection(configEntry.mapTo);
      }
    }

    throw new Error(`Cannot find search result Model by ad collection name: '${collectionName}'.`);
  }

  private getSearchResultModelBySRCollectionName(collectionName: string): Model<any> {
    return this.dbAccessService.getSearchResultsModelByCollection(collectionName);

    throw new Error(`Cannot find search result Model by search result collection name: '${collectionName}'.`);
  }

  private getPastTimeThreshold(currentDate: number, timeString): number {
    return currentDate - convertTimeToMilliseconds(timeString);
  }

  public determineTimeThreshold(cronPattern: string, opts: LaunchSettings): number {
    const { firstRun } = opts;
    const firstRunFromDayStart = Boolean((opts as LaunchSettingsWithFirstRunFromDayStart)?.firstRunFromDayStart);
    const firstRunPastEnabled = !firstRunFromDayStart
      ? Boolean((opts as LaunchSettingsWithFirstRunPast)?.firstRunPast)
      : false;
    const firstRunPast = firstRunPastEnabled ? (opts as LaunchSettingsWithFirstRunPast)?.firstRunPast : '';

    if (firstRun && firstRunFromDayStart) {
      const roundedToday = new Date();

      roundedToday.setHours(0, 0, 0, 0);

      return roundedToday.getTime();
    } else if (firstRun && firstRunPast) {
      return this.getPastTimeThreshold(Date.now(), firstRunPast);
    } else {
      return this.calculateLastExecutionTimestamp(cronPattern, new Date()) - MINUTE_MS;
    }
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

  public async addNewDocs(
    fromAdCollectionName: string,
    toSearchCollectionName: string,
    timeThreshold: number,
  ): Promise<void> {
    try {
      const cacheKeyPrefix = fromAdCollectionName + '_';
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

      const searchResultModel = this.getSearchResultModelByAdCollectionName(fromAdCollectionName);
      const cachedObjectIds: ObjectId[] = this.cacheManager
        .getKeysFilteredBy((key: string): boolean =>
          ObjectId.isValid(key.replace(cacheKeyPrefix, '')),
        )
        .map((key: string): string => key.replace(cacheKeyPrefix, ''))
        .filter((objectId: string): boolean => {
          const timestamp = this.cacheManager.get<number>(cacheKeyPrefix + objectId);

          return timestamp && timestamp > timeThreshold;
        })
        .map((objectId: string): ObjectId => new ObjectId(objectId));
      const filter = {
        _id: { $nin: cachedObjectIds },
        updated_at: { $gt: new Date(timeThreshold) },
        // active_dates: { $elemMatch: { $eq: currentRoundedDate }},
      };
      const docsToProcess = await adModel
        .countDocuments(filter)
        .exec();
      const steps = Math.ceil(docsToProcess / this.processDocsPerOneTime);

      this.logger.log(`Collection: ${fromAdCollectionName}. Documents to process: ${docsToProcess}. Steps: ${steps}`);

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
          .skip(step * this.processDocsPerOneTime)
          .exec();

        const itemsForIndex: Array<Omit<IRentResidential | ISaleResidential, 'priceDeviations'> & { _id: ObjectId }> = docsForTransferToSearchResults
          .map((doc) => adDocToSearchResultMapper<ObjectId>(doc, category));

        const itemsForIndexDocs = itemsForIndex
          .map((item): (IRentResidential | ISaleResidential) & { _id: ObjectId } => calculatePriceDeviations<ObjectId>(
            item,
            districtMonthlyTotalStat,
            districtMonthlyIntermediaryStat,
            districtDailyTotalStat,
            cityMonthlyTotalStat,
            cityMonthlyIntermediaryStat,
            cityDailyTotalStat,
          ));

        const operations = itemsForIndexDocs.map(item => ({
          updateOne: {
            filter: { _id: item._id },
            update: { $set: item },
            upsert: true,
          },
        }));
        const savedIds = [];

        if (operations.length > 0) {
          try {
            await searchResultModel.bulkWrite(operations);

            for (const item of itemsForIndexDocs) {
              savedIds.push(item._id.toString());
            }

            for (const doc of docsForTransferToSearchResults) {
              this.cacheManager.set(cacheKeyPrefix + doc._id.toString(), Date.now());
            }

            this.logger.log(`Processed ${operations.length} documents  of ${ docsForTransferToSearchResults.length }. '${fromAdCollectionName}' ===> '${searchResultModel.collection.collectionName}'`);
          } catch (error) {
            this.logger.error(`Error during bulk write for '${searchResultModel.collection.collectionName}': ${error}`);
          }
        } else {
          this.logger.log('No documents saved');
        }

        for (const doc of docsForTransferToSearchResults) {
          const id = doc._id.toString();

          if (!savedIds.includes(id)) {
            this.logger.warn(`${id} does not saved. District: ${ doc.district }, price: ${ doc.price }, property area: ${ doc['property-area']}`);
          }
        }
      }
    } catch (e) {
      this.logger.error(`Cannot add new documents from '${fromAdCollectionName}' to '${toSearchCollectionName}'.`);
      this.logger.error(e);
    }
  }

  public async removeOldDocs(
    searchCollectionName: string,
    timeThreshold: number,
  ): Promise<void> {
    try {
      const searchResultModel = this.getSearchResultModelBySRCollectionName(searchCollectionName);
      const deleteResult = await searchResultModel.deleteMany({
        updated_at: {
          $lt: new Date(timeThreshold),
        },
      }).exec();

      this.logger.log(`Removed ${deleteResult.deletedCount} old documents from '${searchCollectionName}'`);
    } catch (error) {
      this.logger.error(`Error during removing old documents from '${searchCollectionName}': ${error}`);
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
