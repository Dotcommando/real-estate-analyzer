import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService, DummyLoggerService, LoggerService } from './services';


@Module({
  imports: [
    ConfigModule.forRoot(),
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
