import { Logger as NestLogger, LoggerService } from '@nestjs/common';


export class DummyLogger implements LoggerService {
  log(message: string) {}
  error(message: string, trace: string) {}
  warn(message: string) {}
  debug(message: string) {}
  verbose(message: string) {}
}

export class Logger extends NestLogger implements LoggerService {
}
