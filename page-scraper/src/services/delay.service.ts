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

  private getRandomInRangeTimeMs(from: number, to: number): number {
    return from + Math.random() * (to - from);
  }

  public async delayRequest(): Promise<void> {
    const minDelay = this.from;
    const currentTime = Date.now();
    const elapsedTime = currentTime - this.endOfWaitingTime;

    if (currentTime > this.endOfWaitingTime && elapsedTime < minDelay) {
      const delayTime = this.getRandomInRangeTimeMs(this.from, this.to);

      this.endOfWaitingTime = Date.now() + delayTime;

      await delay(delayTime, this.logger.log.bind(this.logger));
    } else if (currentTime > this.endOfWaitingTime && elapsedTime >= minDelay) {
      this.endOfWaitingTime = Date.now() + 1;

      await delay(0, this.logger.log.bind(this.logger));
    } else {
      // currentTime <= this.endOfWaitingTime
      const delayTime = this.getRandomInRangeTimeMs(this.from, this.to);

      this.endOfWaitingTime = this.endOfWaitingTime + delayTime;

      await delay(this.endOfWaitingTime - currentTime, this.logger.log.bind(this.logger));
    }
  }
}
