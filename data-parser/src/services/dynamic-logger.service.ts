import { Injectable } from '@nestjs/common';

import { IMonitorMessage } from '../types';


@Injectable()
export class DynamicLoggerService {
  constructor() {
  }

  private buffer: IMonitorMessage[] = [];
  private stdout = process.stdout;

  private eraseLines(n: number): void {
    for (let i = 0; i < n; i++) {
      this.stdout.write('\x1b[1A');
      this.stdout.write('\x1b[K');
    }
  }

  public async clearAll(): Promise<void> {
    if (!this.buffer.length) {
      return;
    }

    let linesToErase = 0;

    for (const bufferedNote of this.buffer) {
      const msgLines = (bufferedNote.msg.match(/\n/g) || []).length;

      linesToErase += msgLines + 1;
    }

    this.eraseLines(linesToErase);
  }

  public async update(): Promise<void> {
    await this.clearAll();

    for (const bufferedNote of this.buffer) {
      this.stdout.write(`${bufferedNote.msg}\n`);
    }
  }

  public flushBuffer(): void {
    for (const bufferedNote of this.buffer) {
      this.stdout.write(`${bufferedNote.msg}\n`);
    }
  }

  public write(id: string, ...msg: string[]): void {
    const index: number = this.buffer
      .findIndex((bufferedNote: IMonitorMessage) => bufferedNote.id === id);

    if (index > -1) {
      this.buffer[index].msg = msg.join(' ');
    } else {
      this.buffer.push({
        id,
        msg: msg.join(' '),
      });
    }

    this.update();
  }
}
