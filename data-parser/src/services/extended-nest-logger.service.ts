import { Logger as NestLogger } from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';

import { DAY_MS } from '../constants';
import { getIntFromEnv } from '../utils';


export class ExtendedNestLogger extends NestLogger {
  onModuleInit(): void {
    this.ensureLogsFolderExists();
    this.deleteOutdatedLogs();
  }

  private logsFolder = 'logs';
  private logPrefix = process.env.LOG_PREFIX ?? 'log-';
  private logExpirationDays = getIntFromEnv('KEEP_LOGS_FOR_DAYS', 1);

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

    return `${this.logPrefix}${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}--${timeRange}.log`;
  }

  private deleteOutdatedLogs(): void {
    const currentDate = new Date();
    const files = fs.readdirSync(this.logsFolder, { withFileTypes: true });

    for (const file of files) {
      const fileFormatRegex = new RegExp(`${this.logPrefix}\\d{4}-\\d{2}-\\d{2}--\\d{2}-\\d{2}\\.log`);
      const fileName = file.name;

      if (!fileFormatRegex.test(fileName)) {
        continue;
      }

      const dateRegex = new RegExp('\\d{4}-\\d{2}-\\d{2}');
      const fileNameDate = fileName.match(dateRegex);

      if (!fileNameDate) {
        continue;
      }

      const dateParts = fileNameDate[0].split('-');
      const specifiedDate = new Date(Number(dateParts[0]), parseInt(dateParts[1]) - 1, Number(dateParts[2]));
      const diffMs = Math.abs(Number(currentDate) - Number(specifiedDate));
      const daysMs = (this.logExpirationDays + 1) * DAY_MS;

      if (diffMs >= daysMs) {
        const filePath = path.join(process.cwd(), this.logsFolder, fileName);

        fs.unlinkSync(filePath);
      }
    }
  }

  private ensureLogsFolderExists(): void {
    const folderPath = path.join(process.cwd(), this.logsFolder);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  }

  writeToFile(message: string): void {
    const msg = typeof message === 'string'
      ? message
      : typeof message === 'object'
        ? JSON.stringify(message)
        : String(message);
    const filePath = path.join(process.cwd(), this.logsFolder, this.getFileName());
    const strippedMessage = this.stripColorCodes(msg);

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
