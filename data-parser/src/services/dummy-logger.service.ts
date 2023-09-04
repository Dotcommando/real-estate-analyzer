import { AbstractLogger } from '../classes';


export class DummyLoggerService implements AbstractLogger {
  log(message: string) {}
  error(message: string, trace: string) {}
  warn(message: string) {}
  debug(message: string) {}
  verbose(message: string) {}
}
