import { Logger as NestLogger } from '@nestjs/common';

import { AbstractLogger } from '../classes';


export class DummyLoggerService extends NestLogger implements AbstractLogger {
  log(message: string) {}
  debug(message: string) {}
  verbose(message: string) {}
}