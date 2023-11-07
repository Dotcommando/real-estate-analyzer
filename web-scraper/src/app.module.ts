import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { LOGGER, USER_AGENTS } from './constants';
import {
  AppService,
  CacheService,
  DelayService,
  DummyLoggerService,
  LoggerService,
  ProxyFactoryService,
} from './services';
import { getRandomElement } from './utils';


@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    HttpModule.register({
      timeout: parseInt(process.env.HTTP_GET_TIMEOUT),
      maxRedirects: parseInt(process.env.MAX_REDIRECTS),
      transformRequest: [ (data, headers) => {
        headers['User-Agent'] = getRandomElement(USER_AGENTS);

        return data;
      } ],
    }),
  ],
  controllers: [ AppController ],
  providers: [
    SchedulerRegistry,
    CacheService,
    AppService,
    DelayService,
    ProxyFactoryService,
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
