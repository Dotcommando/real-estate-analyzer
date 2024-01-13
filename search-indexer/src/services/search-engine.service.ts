import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

import { AnyObject, CacheService } from './cache.service';
import { DbAccessService } from './db-access.service';

import { AnalysisPeriod, AnalysisType, Categories, LOGGER } from '../constants';
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
} from '../types';
import {
  calculatePriceDeviations,
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
          .exec();

        const itemsForIndex: Array<Omit<IRentResidential | ISaleResidential, 'priceDeviations'> & { _id: ObjectId }> = docsForTransferToSearchResults
          .filter((doc) => doc.price > 0 && doc['property-area'] > 1)
          .filter((doc) => Boolean(doc.district))
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
              this.cacheManager.set(fromAdCollectionName + '_' + item._id.toString(), true);

              savedIds.push(item._id.toString());
            }

            this.logger.log(`Processed ${operations.length} documents for ${fromAdCollectionName} of ${ docsForTransferToSearchResults.length }.`);
          } catch (error) {
            this.logger.error(`Error during bulk write for '${fromAdCollectionName}': ${error}`);
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
