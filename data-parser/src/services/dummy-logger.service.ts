import { ExtendedNestLogger } from './extended-nest-logger.service';


export class DummyLoggerService extends ExtendedNestLogger {
  log(message: string): void {
    this.writeToFile(message);
  }

  error(message: string): void {
    this.writeToFile(message);
    super.error(message);
  }

  warn(message: string): void {
    this.writeToFile(message);
    super.warn(message);
  }

  debug(message: string): void {
    this.writeToFile(message);
  }

  verbose(message: string) {
    this.writeToFile(message);
  }
}
