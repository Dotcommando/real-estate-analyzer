import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.MANAGER_SERVICE_HOST,
      port: process.env.MANAGER_SERVICE_PORT,
    },
  });

  await app.listen();
}

bootstrap();
