import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [ `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@localhost:${process.env.RABBITMQ_PORT}` ],
      queue: process.env.RABBITMQ_QUEUE_NAME,
      queueOptions: {
        durable: true,
      },
      noAck: true,
      prefetchCount: 1,
    },
  });

  await app.listen();
}
bootstrap();
