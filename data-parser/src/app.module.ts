import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { LOGGER } from './constants';
import { AppService, CacheService, DummyLoggerService, LoggerService, ProxyFactoryService } from './services';


@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  controllers: [ AppController ],
  providers: [
    AppService,
    CacheService,
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
