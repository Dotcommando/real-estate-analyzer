import { HttpStatus, Inject, Injectable, LoggerService, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';

import { config } from 'dotenv';

import { CacheService } from './cache.service';
import { DbAccessService } from './db-access.service';

import { LOGGER } from '../constants';
import { IResponse, ISearchIndexConfig } from '../types';


config();

@Injectable()
export class AppService implements OnModuleInit {
  private searchIndexConfig: ISearchIndexConfig[];

  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly cacheManager: CacheService,
    private readonly dbAccessService: DbAccessService,
  ) {
  }

  public checkHealth(): IResponse<{ alive: boolean }> {
    return {
      status: HttpStatus.OK,
      data: {
        alive: true,
      },
    };
  }

  async onModuleInit(): Promise<void> {
    this.searchIndexConfig = await this.getSearchIndexConfig();
    await this.removeExpiredDocs();
    await this.addNewDocs();
  }

  @Cron(process.env.CRON_REMOVE_EXPIRED)
  private async addNewDocs(): Promise<void> {
    for (const configEntry of this.searchIndexConfig) {
      const collections = configEntry.collections;
    }
  }

  @Cron(process.env.CRON_ADD_NEW)
  private async removeExpiredDocs(): Promise<void> {

  }

  @Cron(process.env.CRON_CLEAR_CACHE, {
    name: 'clear_cache',
    timeZone: process.env.TZ,
  })
  public clearCache() {
    this.cacheManager.clear();
  }

  @Cron(process.env.CRON_CACHE_PERSISTENCE_UPDATE, {
    name: 'update_persistence_cache',
    timeZone: process.env.TZ,
  })
  public updatePersistenceCache() {
    this.cacheManager.updatePersistenceCache();
  }

  private async getSearchIndexConfig(): Promise<ISearchIndexConfig[]> {
    try {
      const searchIndexConfig = JSON.parse(this.configService.get('SEARCH_INDEX_CONFIG'));

      if (!Array.isArray(searchIndexConfig)) {
        throw new Error('SEARCH_INDEX_CONFIG is not an array.');
      }

      if (!searchIndexConfig.length) {
        throw new Error('SEARCH_INDEX_CONFIG array is empty.');
      }

      for (const configEntry of searchIndexConfig) {
        if (!('collections' in configEntry)) {
          throw new Error('One of entry in \'SEARCH_INDEX_CONFIG\' has no \'collections\' property.');
        }

        if (!Array.isArray(configEntry['collections'])) {
          throw new Error('One of entry in \'SEARCH_INDEX_CONFIG\' has \'collections\' which is not an array.');
        }

        if (!configEntry['collections'].length) {
          throw new Error('One of entry in \'SEARCH_INDEX_CONFIG\' has empty \'collections\'.');
        }

        if (!configEntry['mapTo']) {
          throw new Error('One of entry in \'SEARCH_INDEX_CONFIG\' has no \'mapTo\' property.');
        }

        for (const collectionName of configEntry['collections']) {
          const adCollectionModel = this.dbAccessService.getModelByCollection(collectionName);

          if (!adCollectionModel) {
            throw new Error(`Cannot get a model for collection '${collectionName}'.`);
          }
        }

        const searchResultsModel = this.dbAccessService
          .getSearchResultsModelByCollection(configEntry.mapTo);

        if (!searchResultsModel) {
          throw new Error(`Cannot get a search results model for collection '${configEntry.mapTo}'.`);
        }
      }

      return searchIndexConfig as ISearchIndexConfig[];
    } catch (e) {
      this.logger.error('An error occurred during environment variable \'SEARCH_INDEX_CONFIG\' reading.');
      this.logger.error(e);

      process.exit(1);
    }
  }
}
