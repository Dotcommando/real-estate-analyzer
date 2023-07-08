import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { LoggerService, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import * as redisStore from 'cache-manager-ioredis';

import { AppController } from './app.controller';
import { LOGGER, USER_AGENTS } from './constants';
import {
  RentApartmentsFlatsSchema,
  RentCommercialsSchema,
  RentHousesSchema,
  RentPlotsSchema,
  SaleApartmentsFlatsSchema,
  SaleCommercialsSchema,
  SaleHousesSchema,
  SalePlotsSchema,
} from './schemas';
import {
  AppService,
  DbAccessService,
  DelayService,
  DummyLogger,
  Logger,
  MongoConfigService,
  ParseService,
} from './services';
import { getRandomElement } from './utils';


@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: configService.get('RCACHE_TTL'),
        max: configService.get('RCACHE_MAX_ITEMS'),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ ConfigModule ],
      useClass: MongoConfigService,
      inject: [ ConfigService ],
    }),
    MongooseModule.forFeatureAsync([
      {
        name: 'RentApartmentsFlats',
        useFactory: () => RentApartmentsFlatsSchema,
        collection: 'rentapartmentsflats',
      },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: 'RentCommercials',
        useFactory: () => RentCommercialsSchema,
        collection: 'rentcommercials',
      },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: 'RentHouses',
        useFactory: () => RentHousesSchema,
        collection: 'renthouses',
      },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: 'RentPlots',
        useFactory: () => RentPlotsSchema,
        collection: 'rentplots',
      },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: 'SaleApartmentsFlats',
        useFactory: () => SaleApartmentsFlatsSchema,
        collection: 'saleapartmentsflats',
      },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: 'SaleCommercials',
        useFactory: () => SaleCommercialsSchema,
        collection: 'salecommercials',
      },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: 'SaleHouses',
        useFactory: () => SaleHousesSchema,
        collection: 'salehouses',
      },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: 'SalePlots',
        useFactory: () => SalePlotsSchema,
        collection: 'saleplots',
      },
    ]),
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
    ParseService,
    DelayService,
    DbAccessService,
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
