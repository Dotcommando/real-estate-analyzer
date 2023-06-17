import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';

import { LOGGER } from '../constants';
import { dateInHumanReadableFormat } from '../utils';


@Injectable()
export class AsyncQueueService {
  private timeOfLastExecution = Date.now();
  private from = parseInt(this.configService.get('MIN_DELAY'));
  private to = parseInt(this.configService.get('MAX_DELAY'));

  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
  }

  private createHumanReadablePreMessage = (
    name: string,
    delayMs: number | null,
    endOfWaitingTimeMs: number,
    phase: 1 | 2 | 3,
  ): string => {
    const delayS = (Math.round(delayMs / 100) * 100) / 1000;
    const execDate = dateInHumanReadableFormat(new Date(endOfWaitingTimeMs));

    return phase === 1
      ? `${name}, min pause needed, delay: ${delayS}s, run in ${execDate}`
      : phase === 2
        ? `${name}, no pause needed, running now: ${execDate}`
        : `${name}, pause needed, delay: ${delayS}s, run in ${execDate}`;
  };

  private createPreMessage = (name: string, delayMs: number | null, endOfWaitingTimeMs: number, phase: 1 | 2| 3): string => '';

  private getPreMessage = this.configService.get('MODE') === 'prod'
    ? this.createPreMessage
    : this.createHumanReadablePreMessage;

  private createHumanReadablePostMessage = (name: string, delayMs: number | null): string => {
    const delayS = (Math.round(delayMs / 100) * 100) / 1000;

    return delayMs === null
      ? `${name} executed immediately`
      : `${name} executed after delay ${delayS} sec`;
  };

  private createPostMessageForProd = (name: string, delayMs: number | null): string => '';

  private getPostMessage = this.configService.get('MODE') === 'prod'
    ? this.createPostMessageForProd
    : this.createHumanReadablePostMessage;

  private getRandomInRangeTimeMs(from: number, to: number): number {
    return from + Math.random() * (to - from);
  }

  public addTimeout(
    name: string,
    opts: {
      fn: { (...args: any[]): any };
      from?: number;
      to?: number;
    },
  ) {
    const minDelay = opts?.from ? opts.from : this.from;
    const maxDelay = opts?.to ? opts.to : this.to;
    const currentTime = Date.now();
    const elapsedTime = currentTime - this.timeOfLastExecution;
    let randomDelay: number;
    let phase: 1 | 2 | 3;

    if (currentTime > this.timeOfLastExecution && elapsedTime < minDelay) {
      phase = 1;
      randomDelay = this.getRandomInRangeTimeMs(minDelay, maxDelay);

      this.timeOfLastExecution = Date.now() + randomDelay;
    } else if (currentTime > this.timeOfLastExecution && elapsedTime >= minDelay) {
      phase = 2;

      this.timeOfLastExecution = Date.now();
    } else {
      // currentTime <= this.timeOfLastExecution
      phase = 3;
      randomDelay = this.getRandomInRangeTimeMs(minDelay, maxDelay);

      this.timeOfLastExecution = this.timeOfLastExecution + randomDelay;
    }

    const preMessage = this.getPreMessage(name, randomDelay, this.timeOfLastExecution, phase);
    const postMessage = this.getPostMessage(name, randomDelay);

    const callback = async () => {
      await opts.fn();
      this.logger.log(postMessage);
    };
    const timeout = setTimeout(callback.bind(this), this.timeOfLastExecution);

    this.schedulerRegistry.addTimeout(name, timeout);
    this.logger.log(preMessage);
  }
}
