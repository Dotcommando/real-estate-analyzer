import { HttpModule } from '@nestjs/axios';
import { LoggerService, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, TcpClientOptions, Transport } from '@nestjs/microservices';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';

import { config } from 'dotenv';

import { AppController } from './app.controller';
import { LOGGER, USER_AGENTS } from './constants';
import { AppService, AsyncQueueService, CacheService, DelayService, DummyLogger, Logger, ParseService } from './services';
import { getRandomElement } from './utils';


config();

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
  providers: [
    AppService,
    AsyncQueueService,
    CacheService,
    DelayService,
    ParseService,
    SchedulerRegistry,
    {
      provide: LOGGER,
      useFactory: (configService: ConfigService): LoggerService => {
        const environment = configService.get('MODE');

        return environment === 'prod'
          ? new DummyLogger()
          : new Logger();
      },
      inject: [ ConfigService ],
    },
    {
      provide: 'RUNNER_SERVICE',
      useFactory: (configService: ConfigService) => {
        const runnerServiceOptions: TcpClientOptions = {
          options: {
            port: configService.get('RUNNER_SERVICE_PORT'),
            host: configService.get('RUNNER_SERVICE_HOST'),
          },
          transport: Transport.TCP,
        };

        return ClientProxyFactory.create(runnerServiceOptions);
      },
      inject: [ ConfigService ],
    },
  ],
  controllers: [ AppController ],
})
export class AppModule {}
