import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.WEB_SCRAPER_SERVICE_HOST,
      port: process.env.WEB_SCRAPER_SERVICE_PORT,
    },
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.enableShutdownHooks();

  await app.listen();
}

bootstrap();
