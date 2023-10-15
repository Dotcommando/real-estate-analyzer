import { Injectable } from '@nestjs/common';

import { IMonitorMessage } from '../types';


@Injectable()
export class DynamicLoggerService {
  constructor() {
  }

  private buffer: IMonitorMessage[] = [];
  private stdout = process.stdout;
  private printed = false;

  private getTerminalWidth(): number {
    return process.stdout.columns || 80;
  }

  private eraseLines(linesToErase: number): void {
    this.stdout.write(`\x1b[${linesToErase}A\x1b[J`);
  }

  public clearAll(): void {
    if (!this.buffer.length || !this.printed) {
      return;
    }

    let linesToErase = 0;

    for (const bufferedNote of this.buffer) {
      const terminalWidth = this.getTerminalWidth();
      const msgLines = Math.ceil(bufferedNote.msg.length / terminalWidth) + (bufferedNote.msg.match(/\n/g) || []).length;

      linesToErase += msgLines;
    }

    this.eraseLines(linesToErase);

    this.printed = false;
  }

  public update(): void {
    this.clearAll();

    for (const bufferedNote of this.buffer) {
      this.stdout.write(bufferedNote.msg);
    }

    this.printed = true;
  }

  public flushBuffer(): void {
    for (const bufferedNote of this.buffer) {
      this.stdout.write(bufferedNote.msg);
    }

    this.printed = true;
  }

  public write(id: string, ...msg: string[]): void {
    const index: number = this.buffer
      .findIndex((bufferedNote: IMonitorMessage) => bufferedNote.id === id);

    if (index > -1) {
      this.buffer[index].msg = msg.join(' ') + '\n';
    } else {
      this.buffer.push({
        id,
        msg: msg.join(' ') + '\n',
      });
    }
  }
}
