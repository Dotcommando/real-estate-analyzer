import { Logger as NestLogger } from '@nestjs/common';

import { StatusMonitorService } from './status-monitor.service';

import { AbstractLogger } from '../classes';


export class DummyLoggerService extends NestLogger implements AbstractLogger {
  constructor(
    private readonly statusMonitorService: StatusMonitorService,
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

  debug(message: string) {}
  verbose(message: string) {}
}
