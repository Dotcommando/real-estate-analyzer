import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AnalysisCityStatsSchema, AnalysisDistrictStatsSchema } from './schemas';
import { AppService, DummyLoggerService, LoggerService, MongoConfigService } from './services';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ ConfigModule ],
      useClass: MongoConfigService,
      inject: [ ConfigService ],
    }),
    MongooseModule.forFeatureAsync([
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
    ]),
  ],
  controllers: [ AppController ],
  providers: [
    AppService,
    {
      provide: LoggerService,
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
