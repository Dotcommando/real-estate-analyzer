import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { delay } from '../utils';


@Injectable()
export class DelayService {
  constructor(
    private readonly configService: ConfigService,
  ) {
  }

  private from = parseInt(this.configService.get('MIN_DELAY'));
  private to = parseInt(this.configService.get('MAX_DELAY'));

  private getRandomInRangeTimeMs(from: number, to: number): number {
    return from + Math.random() * (to - from);
  }

  public async delay() {
    return await delay(this.getRandomInRangeTimeMs(this.from, this.to));
  }
}
