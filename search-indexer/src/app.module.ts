import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import {
  AnalysisCityStatsSchema,
  AnalysisDistrictStatsSchema,
  RentApartmentsFlatsSchema,
  RentCommercialsSchema,
  RentHousesSchema,
  RentPlotsSchema,
  RentResidentialSchema,
  SaleApartmentsFlatsSchema,
  SaleCommercialsSchema,
  SaleHousesSchema,
  SalePlotsSchema,
} from './schemas';
import { AppService, MongoConfigService } from './services';


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
      {
        name: 'RentCommercials',
        useFactory: () => RentCommercialsSchema,
        collection: 'rentcommercials',
      },
      {
        name: 'RentHouses',
        useFactory: () => RentHousesSchema,
        collection: 'renthouses',
      },
      {
        name: 'RentPlots',
        useFactory: () => RentPlotsSchema,
        collection: 'rentplots',
      },
      {
        name: 'SaleApartmentsFlats',
        useFactory: () => SaleApartmentsFlatsSchema,
        collection: 'saleapartmentsflats',
      },
      {
        name: 'SaleCommercials',
        useFactory: () => SaleCommercialsSchema,
        collection: 'salecommercials',
      },
      {
        name: 'SaleHouses',
        useFactory: () => SaleHousesSchema,
        collection: 'salehouses',
      },
      {
        name: 'SalePlots',
        useFactory: () => SalePlotsSchema,
        collection: 'saleplots',
      },
      {
        name: 'CityStatsRentFlats',
        useFactory: () => AnalysisCityStatsSchema,
        collection: 'rentapartmentsflats_analysis',
      },
      {
        name: 'CityStatsRentHouses',
        useFactory: () => AnalysisCityStatsSchema,
        collection: 'renthouses_analysis',
      },
      {
        name: 'DistrictStatsRentFlats',
        useFactory: () => AnalysisDistrictStatsSchema,
        collection: 'rentapartmentsflats_analysis',
      },
      {
        name: 'DistrictStatsRentHouses',
        useFactory: () => AnalysisDistrictStatsSchema,
        collection: 'renthouses_analysis',
      },
      {
        name: 'CityStatsSaleFlats',
        useFactory: () => AnalysisCityStatsSchema,
        collection: 'saleapartmentsflats_analysis',
      },
      {
        name: 'CityStatsSaleHouses',
        useFactory: () => AnalysisCityStatsSchema,
        collection: 'salehouses_analysis',
      },
      {
        name: 'DistrictStatsSaleFlats',
        useFactory: () => AnalysisDistrictStatsSchema,
        collection: 'saleapartmentsflats_analysis',
      },
      {
        name: 'DistrictStatsSaleHouses',
        useFactory: () => AnalysisDistrictStatsSchema,
        collection: 'salehouses_analysis',
      },
      {
        name: 'RentResidentials',
        useFactory: () => RentResidentialSchema,
        collection: 'sr_rentresidentials',
      },
    ]),
  ],
  controllers: [ AppController ],
  providers: [ AppService ],
})
export class AppModule {}
