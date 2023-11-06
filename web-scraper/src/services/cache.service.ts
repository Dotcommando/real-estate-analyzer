import { Inject, Injectable, LoggerService, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as fs from 'fs';
import * as path from 'path';

import { LOGGER } from '../constants';


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

    return `cache-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.json`;
  }

  private readonly ttl = parseInt(this.configService.get('CACHE_TTL')) * 1000;
  private readonly maxItems = parseInt(this.configService.get('CACHE_MAX_ITEMS'));
  private cacheMap = new Map<string, unknown>();
  private cacheKeys = new Set<string>();

  public onModuleInit() {
    const filePath = path.join(process.cwd(), this.cacheFolder, this.getFileName());

    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      const json = JSON.parse(data);
      const map = new Map<string, unknown>(json);

      if (map.size) {
        this.cacheMap = map;
      }
    }

    this.logger.log('Cache Service initialized');
  }

  private add(key: string, value: string): void {
    this.cacheMap.set(key, value);
    this.cacheKeys.add(key);
  }

  private deleteOldest() {
    const keys = this.cacheMap.keys();
    const keyToDelete = keys.next().value;

    this.del(keyToDelete);
  }

  public updatePersistenceCache(): void {
    const filePath = path.join(process.cwd(), this.cacheFolder, this.getFileName());
    const data = JSON.stringify([ ...this.cacheMap ]);

    if (this.cacheMap.size) {
      fs.writeFileSync(filePath, data);
    }
  }

  public keysStartsWith(prefix?: string): string[] {
    if (!prefix) {
      return Array.from(this.cacheKeys);
    }

    return Array.from(this.cacheKeys)
      .filter((key: string) => key.startsWith(prefix));
  }

  public del(key: string): void {
    this.cacheMap.delete(key);
    this.cacheKeys.delete(key);
  }

  public async set(key: string, value: unknown, ttl?: number): Promise<void> {
    const stringifiedValue = typeof value === 'string'
      ? value
      : typeof value === 'object'
        ? JSON.stringify(value)
        : String(value);

    this.add(key, stringifiedValue);

    if (this.cacheMap.size > this.maxItems) {
      this.deleteOldest();
    }

    if (ttl !== 0) {
      setTimeout(() => {
        this.del(key);
      }, ttl === undefined ? this.ttl : ttl);
    }
  }

  public get(key: string): string {
    return this.cacheMap.get(key) as string;
  }

  public clear(): void {
    const filePath = path.join(process.cwd(), this.cacheFolder, this.getFileName());

    fs.writeFileSync(filePath, '');

    this.cacheMap.clear();
    this.cacheKeys.clear();
    this.logger.warn(' ');
    this.logger.warn('    >>>>    Cache fully cleared');
  }
}
