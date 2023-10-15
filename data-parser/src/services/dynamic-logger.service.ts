import { Injectable } from '@nestjs/common';

import * as logUpdateProxy from '../../src/log-update-wrapper.js';


@Injectable()
export class DynamicLoggerService {
  private logUpdate: any;

  constructor() {
    this.initialize();
  }

  async initialize() {
    this.logUpdate = await logUpdateProxy.getLogUpdate();
  }

  private buffer: string[] = [];

  public update(): void {
    this.logUpdate(this.buffer.join('\n'));
  }

  public write(...msg: string[]): void {
    const length = msg.length;

    for (let i = 0; i < length; i++) {
      this.buffer.push(msg[i]);
    }
  }
}
