import { Inject, Injectable, LoggerService, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CacheService } from './cache.service';

import { LOGGER, UrlTypes } from '../constants';
import { ITcpMessageResult, IUrlData } from '../types';


@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService,
    private readonly cacheManager: CacheService,
    private readonly configService: ConfigService,
  ) {
  }

  onModuleInit(): void {
  }
}
