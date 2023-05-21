import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AppController } from './app.controller';
import { ServiceName } from './constants';
import { AppService, ParseService } from './services';


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
    HttpModule.register({
      timeout: parseInt(process.env.HTTP_GET_TIMEOUT),
      maxRedirects: parseInt(process.env.MAX_REDIRECTS),
    }),
  ],
  providers: [ AppService, ParseService ],
  controllers: [ AppController ],
})
export class AppModule {}
