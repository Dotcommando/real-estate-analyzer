import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { HttpCommonExceptionFilter } from './filters';
import { StatusInterceptor } from './interceptors';


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: process.env.SEARCH_INDEXER_SERVICE_HOST,
      port: process.env.SEARCH_INDEXER_SERVICE_TCP_PORT,
    },
  });

  app.enableShutdownHooks();
  app.useGlobalFilters(new HttpCommonExceptionFilter());
  app.useGlobalInterceptors(new StatusInterceptor());

  await app.listen(parseInt(process.env.SEARCH_INDEXER_SERVICE_HTTP_PORT));
}

bootstrap();
