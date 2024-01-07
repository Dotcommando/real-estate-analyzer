import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';

import { config } from 'dotenv';
import { ObjectId } from 'mongodb';

import { CacheService } from './cache.service';
import { DbAccessService } from './db-access.service';

import { AnalysisPeriod, AnalysisType, LOGGER } from '../constants';
import { IAnalysis, ICityStats, IDistrictStats } from '../types';
import {
  analysisCityMapper,
  analysisDistrictMapper,
  restoreAnalysisCityFromCache,
  restoreAnalysisDistrictFromCache,
  roundDate,
} from '../utils';


config();

@Injectable()
export class SearchEngineService {
  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly cacheManager: CacheService,
    private readonly dbAccessService: DbAccessService,
  ) {
  }

  @Cron(process.env.CRON_CLEAR_CACHE, {
    name: 'clear_cache',
    timeZone: process.env.TZ,
  })
  private clearCache() {
    this.cacheManager.clear();
  }

  @Cron(process.env.CRON_CACHE_PERSISTENCE_UPDATE, {
    name: 'update_persistence_cache',
    timeZone: process.env.TZ,
  })
  private updatePersistenceCache() {
    this.cacheManager.updatePersistenceCache();
  }

  private async getStats<T>(
    adCollectionName: string,
    date: Date,
    analysisPeriod: AnalysisPeriod,
    analysisType: AnalysisType,
    mapperFunction: (doc: any) => IAnalysis<string, T>,
    restoreFunction: (cacheData: string) => IAnalysis<string, T>,
  ): Promise<IAnalysis<string, T> | null> {
    if (date.getDate() === 1 && analysisPeriod === AnalysisPeriod.MONTHLY_INTERMEDIARY) {
      const previousMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);

      return this.getStats(adCollectionName, previousMonth, AnalysisPeriod.MONTHLY_TOTAL, analysisType, mapperFunction, restoreFunction);
    }

    const cacheKey = `${roundDate(date).toLocaleString()}_${adCollectionName}_${analysisType}_${analysisPeriod}`;
    const fromCache = this.cacheManager.get(cacheKey);

    if (fromCache) {
      return restoreFunction(fromCache);
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

      await this.cacheManager.set(cacheKey, mappedResult);

      return mappedResult;
    }

    return null;
  }

  public async addNewDocs(fromAdCollectionName: string, toSearchCollectionName: string): Promise<void> {
    try {
      const adModel = this.dbAccessService.getModelByCollection(fromAdCollectionName);
      const currentRoundedDate = roundDate(new Date());
      const districtMonthlyTotalStat = await this.getStats<IDistrictStats>(
        fromAdCollectionName,
        roundDate(new Date()),
        AnalysisPeriod.MONTHLY_TOTAL,
        AnalysisType.DISTRICT_AVG_MEAN,
        analysisDistrictMapper,
        restoreAnalysisDistrictFromCache,
      );

      const districtMonthlyIntermediaryStat = await this.getStats<IDistrictStats>(
        fromAdCollectionName,
        roundDate(new Date()),
        AnalysisPeriod.MONTHLY_INTERMEDIARY,
        AnalysisType.DISTRICT_AVG_MEAN,
        analysisDistrictMapper,
        restoreAnalysisDistrictFromCache,
      );

      const districtDailyTotalStat = await this.getStats<IDistrictStats>(
        fromAdCollectionName,
        roundDate(new Date()),
        AnalysisPeriod.DAILY_TOTAL,
        AnalysisType.DISTRICT_AVG_MEAN,
        analysisDistrictMapper,
        restoreAnalysisDistrictFromCache,
      );

      const cityMonthlyTotalStat = await this.getStats<ICityStats>(
        fromAdCollectionName,
        roundDate(new Date()),
        AnalysisPeriod.MONTHLY_TOTAL,
        AnalysisType.CITY_AVG_MEAN,
        analysisCityMapper,
        restoreAnalysisCityFromCache,
      );

      const cityMonthlyIntermediaryStat = await this.getStats<ICityStats>(
        fromAdCollectionName,
        roundDate(new Date()),
        AnalysisPeriod.MONTHLY_INTERMEDIARY,
        AnalysisType.CITY_AVG_MEAN,
        analysisCityMapper,
        restoreAnalysisCityFromCache,
      );

      const cityDailyTotalStat = await this.getStats<ICityStats>(
        fromAdCollectionName,
        roundDate(new Date()),
        AnalysisPeriod.DAILY_TOTAL,
        AnalysisType.CITY_AVG_MEAN,
        analysisCityMapper,
        restoreAnalysisCityFromCache,
      );

      console.log('');
      console.log('');
      console.log('');
      console.log(fromAdCollectionName);
      console.log({ ...cityDailyTotalStat, data: '...' });

      const cachedObjectIds: ObjectId[] = this.cacheManager
        .getKeysFilteredBy((key: string): boolean => ObjectId.isValid(key.replace(fromAdCollectionName + '_', '')))
        .map((objectId: string): string => objectId.replace(fromAdCollectionName + '_', ''))
        .map((objectId: string): ObjectId => new ObjectId(objectId));
      const docs = await adModel
        .find({
          _id: { $nin: cachedObjectIds },
          updated_at: { $gt: currentRoundedDate },
          // active_dates: { $elemMatch: { $eq: currentRoundedDate }},
        })
        .exec();


    } catch (e) {
      this.logger.error(`Cannot add new documents from '${fromAdCollectionName}' to '${toSearchCollectionName}'.`);
      this.logger.error(e);
    }
  }
}
