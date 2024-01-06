import { HttpStatus, Inject, Injectable, LoggerService, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { config } from 'dotenv';

import { CacheService } from './cache.service';

import { LOGGER } from '../constants';
import { IResponse } from '../types';


config();

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService,
    private readonly cacheManager: CacheService,
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
    await this.removeExpiredDocs();
    await this.addNewDocs();
  }

  @Cron(process.env.CRON_REMOVE_EXPIRED)
  private async addNewDocs(): Promise<void> {

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
}
