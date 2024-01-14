import { Inject, Injectable, LoggerService, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';

import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

import { LOGGER } from '../constants';
import { deepFreeze, deserializeCacheValue, isObjectOrArray, serializeCacheValue } from '../utils';


config();

export interface AnyObject {
  [key: string]: unknown;
}

@Injectable()
export class CacheService implements OnApplicationShutdown, OnModuleInit {
  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {
    this.ensureCacheFolderExists();

    this.del = this.del.bind(this);
  }

  public onApplicationShutdown(signal: string) {
    this.updatePersistenceCache();
  }

  private cacheFolder = 'cache';

  private ensureCacheFolderExists(): void {
    const folderPath = path.join(process.cwd(), this.cacheFolder);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  }

  private getFileName(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `cache-${year}-${month}-${day}.json`;
  }

  private readonly ttl = parseInt(this.configService.get('CACHE_TTL_SEC')) * 1000;
  private readonly maxItems = parseInt(this.configService.get('CACHE_MAX_ITEMS'));
  private cacheMap = new Map<string, unknown>();

  public onModuleInit() {
    this.restoreCacheFromFile();
    this.logger.log('Cache Service initialized');
  }

  private restoreCacheFromFile(): void {
    try {
      const filePath = path.join(process.cwd(), this.cacheFolder, this.getFileName());

      if (!fs.existsSync(filePath)) {
        return;
      }

      const data = fs.readFileSync(filePath, 'utf-8');
      const json = JSON.parse(data);

      this.cacheMap = new Map();

      for (const entry of json) {
        this.cacheMap.set(entry[0], deserializeCacheValue(entry[1]));
      }
    } catch (e) {
      this.logger.error(`Cannot restore cache from the cache file ${this.getFileName()}`);
      this.logger.error(e.message);
    }
  }

  private add<T>(key: string, value: T): void {
    this.cacheMap.set(key, value);
  }

  private deleteOldest() {
    const keys = this.cacheMap.keys();
    const keyToDelete = keys.next().value;

    this.del(keyToDelete);
  }

  @Cron(process.env.CRON_CACHE_PERSISTENCE_UPDATE, {
    name: 'update_persistence_cache',
    timeZone: process.env.TZ,
  })
  public updatePersistenceCache(): void {
    const filePath = path.join(process.cwd(), this.cacheFolder, this.getFileName());
    const serializedMap = Array
      .from(this.cacheMap.entries())
      .map(([ key, value ]) => [ key, serializeCacheValue(value) ]);
    const data = JSON.stringify(serializedMap);

    if (this.cacheMap.size) {
      fs.writeFileSync(filePath, data);
    }
  }

  public del(key: string): void {
    this.cacheMap.delete(key);
  }

  public async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    this.add<T>(key, value);

    if (this.cacheMap.size > this.maxItems) {
      this.deleteOldest();
    }

    if (ttl !== 0) {
      setTimeout(() => {
        this.del(key);
      }, ttl === undefined ? this.ttl : ttl);
    }
  }

  public async setRawObject(key: string, value: AnyObject | unknown[], ttl?: number): Promise<void> {
    if (!isObjectOrArray(value)) {
      throw new Error('\'value\' argument for \'setRawObject\' must have object type.');
    }

    this.cacheMap.set(key, deepFreeze(value));

    if (this.cacheMap.size > this.maxItems) {
      this.deleteOldest();
    }

    if (ttl !== 0) {
      setTimeout(() => {
        this.del(key);
      }, ttl === undefined ? this.ttl : ttl);
    }
  }

  public get<T>(key: string): T | undefined {
    return this.cacheMap.get(key) as T | undefined;
  }

  public getRawObject<T>(key: string): T | undefined {
    return this.cacheMap.get(key) as T | undefined;
  }

  @Cron(process.env.CRON_CLEAR_CACHE, {
    name: 'clear_cache',
    timeZone: process.env.TZ,
  })
  public clear(): void {
    const filePath = path.join(process.cwd(), this.cacheFolder, this.getFileName());

    fs.writeFileSync(filePath, '');

    this.cacheMap.clear();
    this.logger.warn(' ');
    this.logger.warn('    >>>>    Cache fully cleared');
  }

  public getKeysFilteredBy(filterFn: (key: string) => boolean): string[] {
    const filteredKeys = [];

    for (const key of this.cacheMap.keys()) {
      if (filterFn(key)) {
        filteredKeys.push(key);
      }
    }

    return filteredKeys;
  }
}
