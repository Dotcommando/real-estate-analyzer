import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { LOGGER } from './constants';
import {
  AppService,
  CacheService,
  DbUrlRelationService,
  DummyLoggerService,
  LoggerService,
  ProxyFactoryService,
} from './services';


@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
  ],
  controllers: [ AppController ],
  providers: [
    DbUrlRelationService,
    AppService,
    CacheService,
    ProxyFactoryService,
    SchedulerRegistry,
    {
      provide: LOGGER,
      useFactory: (configService: ConfigService) => {
        const environment = configService.get('MODE');

        return environment === 'prod'
          ? new DummyLoggerService()
          : new LoggerService();
      },
      inject: [ ConfigService ],
    },
  ],
})
export class AppModule {}
