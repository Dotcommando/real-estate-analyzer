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

  private async getDistrictStats(adCollectionName: string, date: Date, analysisPeriod: AnalysisPeriod): Promise<IAnalysis<string, IDistrictStats> | null> {
    if (date.getDate() === 1 && analysisPeriod === AnalysisPeriod.MONTHLY_INTERMEDIARY) {
      const previousMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);

      return this.getDistrictStats(adCollectionName, previousMonth, AnalysisPeriod.MONTHLY_TOTAL);
    }

    const cacheKey = `${roundDate(date).toLocaleString()}_${adCollectionName}_${AnalysisType.DISTRICT_AVG_MEAN}_${analysisPeriod}`;
    const fromCache = this.cacheManager.get(cacheKey);

    if (fromCache) {
      return restoreAnalysisDistrictFromCache(fromCache);
    }

    const analysisCollectionName = this.dbAccessService.getRelatedAnalysisCollection(adCollectionName);
    const analysisDistrictModel = this.dbAccessService
      .getAnalysisModelByCollection(analysisCollectionName, AnalysisType.DISTRICT_AVG_MEAN);

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

    const districtStatDoc = await analysisDistrictModel
      .findOne({
        $and: [
          { analysis_period: analysisPeriod },
          { analysis_type: AnalysisType.DISTRICT_AVG_MEAN },
          { start_date: { $eq: startDate }},
          { end_date: { $eq: endDate }},
        ],
      })
      .exec();

    if (districtStatDoc) {
      const mappedResult = analysisDistrictMapper(districtStatDoc);

      await this.cacheManager.set(cacheKey, mappedResult);

      return mappedResult;
    }

    return null;
  }

  private async getCityStats(adCollectionName: string, date: Date, analysisPeriod: AnalysisPeriod): Promise<IAnalysis<string, ICityStats> | null> {
    if (date.getDate() === 1 && analysisPeriod === AnalysisPeriod.MONTHLY_INTERMEDIARY) {
      const previousMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);

      return this.getCityStats(adCollectionName, previousMonth, AnalysisPeriod.MONTHLY_TOTAL);
    }

    const cacheKey = `${roundDate(date).toLocaleString()}_${adCollectionName}_${AnalysisType.CITY_AVG_MEAN}_${analysisPeriod}`;
    const fromCache = this.cacheManager.get(cacheKey);

    if (fromCache) {
      return restoreAnalysisCityFromCache(fromCache);
    }

    const analysisCollectionName = this.dbAccessService.getRelatedAnalysisCollection(adCollectionName);
    const analysisCityModel = this.dbAccessService
      .getAnalysisModelByCollection(analysisCollectionName, AnalysisType.CITY_AVG_MEAN);

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

    const cityStatDoc = await analysisCityModel
      .findOne({
        $and: [
          { analysis_period: analysisPeriod },
          { analysis_type: AnalysisType.CITY_AVG_MEAN },
          { start_date: { $eq: startDate }},
          { end_date: { $eq: endDate }},
        ],
      })
      .exec();

    if (cityStatDoc) {
      const mappedResult = analysisCityMapper(cityStatDoc);

      await this.cacheManager.set(cacheKey, mappedResult);

      return mappedResult;
    }

    return null;
  }

  public async addNewDocs(fromAdCollectionName: string, toSearchCollectionName: string): Promise<void> {
    try {
      const adModel = this.dbAccessService.getModelByCollection(fromAdCollectionName);
      const currentRoundedDate = roundDate(new Date());
      const districtMonthlyTotalStat = await this.getDistrictStats(fromAdCollectionName, roundDate(new Date()), AnalysisPeriod.MONTHLY_TOTAL);
      const districtMonthlyIntermediaryStat = await this.getDistrictStats(fromAdCollectionName, roundDate(new Date()), AnalysisPeriod.MONTHLY_INTERMEDIARY);
      const districtDailyTotalStat = await this.getDistrictStats(fromAdCollectionName, roundDate(new Date()), AnalysisPeriod.DAILY_TOTAL);
      const cityMonthlyTotalStat = await this.getCityStats(fromAdCollectionName, roundDate(new Date()), AnalysisPeriod.MONTHLY_TOTAL);
      const cityMonthlyIntermediaryStat = await this.getCityStats(fromAdCollectionName, roundDate(new Date()), AnalysisPeriod.MONTHLY_INTERMEDIARY);
      const cityDailyTotalStat = await this.getCityStats(fromAdCollectionName, roundDate(new Date()), AnalysisPeriod.DAILY_TOTAL);

      console.log('');
      console.log('');
      console.log('');
      console.log(fromAdCollectionName);
      console.log({ ...districtDailyTotalStat, data: '...' });

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
