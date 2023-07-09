import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LOGGER } from '../constants';
import { delay } from '../utils';


@Injectable()
export class DelayService {
  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {
  }

  private endOfWaitingTime = Date.now();
  private from = parseInt(this.configService.get('MIN_DELAY'));
  private to = parseInt(this.configService.get('MAX_DELAY'));
  private threadLocked = false;

  private getRandomInRangeTimeMs(from: number, to: number): number {
    return from + Math.random() * (to - from);
  }

  public async delayRequest(): Promise<number> {
    const minDelay = this.from;
    const currentTime = Date.now();
    const elapsedTime = currentTime - this.endOfWaitingTime;

    if (currentTime > this.endOfWaitingTime && elapsedTime < minDelay) {
      const delayTime = this.getRandomInRangeTimeMs(this.from, this.to);

      this.endOfWaitingTime = Date.now() + delayTime;

      return await delay(delayTime);
    } else if (currentTime > this.endOfWaitingTime && elapsedTime >= minDelay) {
      this.endOfWaitingTime = Date.now() + 1;

      return await delay(0);
    } else {
      // currentTime <= this.endOfWaitingTime
      const delayTime = this.getRandomInRangeTimeMs(this.from, this.to);

      this.endOfWaitingTime = this.endOfWaitingTime + delayTime;

      return await delay(this.endOfWaitingTime - currentTime);
    }
  }

  public getThreadStatus(): boolean {
    return this.threadLocked;
  }

  public setThreadStatus(locked: boolean): void {
    this.threadLocked = locked;
  }
}
