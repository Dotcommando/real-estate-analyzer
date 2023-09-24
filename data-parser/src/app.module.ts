import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { LOGGER } from './constants';
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
  DbUrlRelationService,
  DummyLoggerService,
  DynamicLoggerService,
  LoggerService,
  MongoConfigService,
  ProxyFactoryService,
  StatisticCollectorService,
} from './services';


@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
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
  ],
  controllers: [ AppController ],
  providers: [
    DbAccessService,
    DbUrlRelationService,
    AppService,
    ProxyFactoryService,
    SchedulerRegistry,
    DynamicLoggerService,
    StatisticCollectorService,
    {
      provide: LOGGER,
      useFactory: (
        configService: ConfigService,
        statusMonitorService: DynamicLoggerService,
      ) => {
        const environment = configService.get('MODE');

        return environment === 'prod'
          ? new DummyLoggerService(statusMonitorService)
          : new LoggerService(statusMonitorService);
      },
      inject: [ ConfigService, DynamicLoggerService ],
    },
  ],
})
export class AppModule {}
