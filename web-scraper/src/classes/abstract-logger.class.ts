import { Injectable, Logger as NestLogger } from '@nestjs/common';


@Injectable()
export abstract class AbstractLogger {
  abstract log(...args: unknown[]): void;

  abstract error(message: string, trace: string): void;

  abstract warn(message: string): void;

  abstract debug(message: string): void;

  abstract verbose(message: string): void;
}
