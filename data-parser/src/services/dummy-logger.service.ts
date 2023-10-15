import { Logger as NestLogger } from '@nestjs/common';

import { AbstractLogger } from '../classes';


export class DummyLoggerService extends NestLogger implements AbstractLogger {
  constructor() {
    super();
  }

  async log(message: string): Promise<void> {
    super.log(message);
  }

  async error(message: string): Promise<void> {
    super.error(message);
  }

  debug(message: string) {}
  verbose(message: string) {}
}
