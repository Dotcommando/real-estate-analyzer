import { Inject, Injectable, LoggerService, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LOGGER } from '../constants';


@Injectable()
export class CacheService implements OnModuleInit {
  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {
    this.del = this.del.bind(this);
  }

  private readonly ttl = parseInt(this.configService.get('CACHE_TTL'));
  private readonly maxItems = parseInt(this.configService.get('CACHE_MAX_ITEMS'));
  private cacheMap = new Map<string, unknown>();
  private cacheKeys = new Set<string>();

  public onModuleInit() {
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
}
