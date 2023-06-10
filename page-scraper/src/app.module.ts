import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';

import * as redisStore from 'cache-manager-ioredis';

import { AppController } from './app.controller';
import { ServiceName, UserAgents } from './constants';
import {
  RentApartmentsFlatsSchema,
  RentCommercialSchema,
  RentHousesSchema,
  RentPlotsSchema,
  SaleApartmentsFlatsSchema,
  SaleCommercialSchema,
  SaleHousesSchema,
  SalePlotsSchema,
} from './schemas';
import { AppService, DbAccessService, DelayService, MongoConfigService, ParseService } from './services';
import { getRandomElement } from './utils';


@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: ServiceName,
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://localhost:${process.env.RABBITMQ_PORT}`,
            // `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@localhost:${process.env.RABBITMQ_PORT}`,
          ],
          queue: process.env.URL_QUEUE_NAME,
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
        ttl: configService.get('CACHE_TTL'),
        max: configService.get('CACHE_MAX_ITEMS'),
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
        name: 'RentCommercial',
        useFactory: () => RentCommercialSchema,
        collection: 'rentcommercial',
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
        name: 'SaleCommercial',
        useFactory: () => SaleCommercialSchema,
        collection: 'salecommercial',
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
        headers['User-Agent'] = getRandomElement(UserAgents);

        return data;
      } ],
    }),
  ],
  providers: [ AppService, ParseService, DelayService, DbAccessService ],
  controllers: [ AppController ],
})
export class AppModule {}
