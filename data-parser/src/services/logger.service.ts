import { Logger as NestLogger } from '@nestjs/common';

import { DynamicLoggerService } from './dynamic-logger.service';

import { AbstractLogger } from '../classes';


export class LoggerService extends NestLogger implements AbstractLogger {
  constructor(
    private readonly statusMonitorService: DynamicLoggerService,
  ) {
    super();
  }

  async log(message: string): Promise<void> {
    await this.statusMonitorService.clearAll();
    super.log(message);
    this.statusMonitorService.flushBuffer();
  }

  async error(message: string): Promise<void> {
    await this.statusMonitorService.clearAll();
    super.error(message);
    this.statusMonitorService.flushBuffer();
  }
}
