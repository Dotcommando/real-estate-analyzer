import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import helmet from '@fastify/helmet';

import { fastifyCookie } from 'fastify-cookie';
import fastifyCsrf from 'fastify-csrf';
import * as morgan from 'morgan';

import { AppModule } from './app.module';
import { HttpCommonExceptionFilter } from './filters';
import { StatusInterceptor } from './interceptors';


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.useGlobalFilters(new HttpCommonExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(new StatusInterceptor());
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: `${process.env.ORIGIN_PROTOCOL}://${process.env.ORIGIN_HOST}${process.env.ORIGIN_PORT && process.env.ORIGIN_PORT !== '80' ? ':' + process.env.ORIGIN_PORT : ''}`,
  });

  app.register(fastifyCookie);
  app.register(fastifyCsrf);
  app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [ '\'self\'' ],
        styleSrc: [ '\'self\'', '\'unsafe-inline\'' ],
        imgSrc: [ '\'self\'', 'data:', 'validator.swagger.io' ],
        scriptSrc: [ '\'self\'', 'https: \'unsafe-inline\'' ],
      },
    },
  });

  if (process.env.MODE === 'dev') {
    app.use(morgan('tiny'));
  }

  await app.listen(parseInt(process.env.GATEWAY_PORT));
}

bootstrap();
