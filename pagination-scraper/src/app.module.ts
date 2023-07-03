import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { LoggerService, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';

import * as redisStore from 'cache-manager-ioredis';
import { config } from 'dotenv';

import { AppController } from './app.controller';
import { LOGGER, ServiceName, USER_AGENTS } from './constants';
import { AppService, AsyncQueueService, DelayService, DummyLogger, Logger, ParseService } from './services';
import { getRandomElement } from './utils';


config();

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    ClientsModule.register([
      {
        name: ServiceName,
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@localhost:${process.env.RABBITMQ_PORT}`,
          ],
          queue: process.env.RABBITMQ_QUEUE_NAME,
          queueOptions: {
            durable: true,
          },
          prefetchCount: 1,
          noAck: true,
        },
      },
    ]),
    CacheModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: configService.get('MCACHE_TTL'),
        max: configService.get('MCACHE_MAX_ITEMS'),
      }),
    }),
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
  ],
  controllers: [ AppController ],
})
export class AppModule {}
