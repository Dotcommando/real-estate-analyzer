import { Logger as NestLogger, OnModuleInit } from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';

import { AbstractLogger } from '../classes';


export class LoggerService extends NestLogger implements AbstractLogger, OnModuleInit {
  onModuleInit(): void {
    this.ensureLogsFolderExists();
  }

  private logsFolder = 'logs';

  private getFileName(): string {
    const date = new Date();
    const hours = date.getHours();

    let timeRange: string;

    if (hours < 6) {
      timeRange = '00-06';
    } else if (hours < 12) {
      timeRange = '06-12';
    } else if (hours < 18) {
      timeRange = '12-18';
    } else {
      timeRange = '18-00';
    }

    return `log-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}--${timeRange}.log`;
  }

  private ensureLogsFolderExists(): void {
    const folderPath = path.join(process.cwd(), this.logsFolder);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  }

  private writeToFile(message: string): void {
    const filePath = path.join(process.cwd(), this.logsFolder, this.getFileName());
    const strippedMessage = this.stripColorCodes(message);

    fs.appendFileSync(filePath, `${strippedMessage}\n`);
  }

  private stripColorCodes(input: string): string {
    const colorCodesRegex = /\x1b\[\d{1,2}m/g;

    return input.replace(colorCodesRegex, '');
  }

  log(message: string): void {
    this.writeToFile(message);
    super.log(message);
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
    super.debug(message);
  }

  verbose(message: string) {
    this.writeToFile(message);
    super.verbose(message);
  }
}
