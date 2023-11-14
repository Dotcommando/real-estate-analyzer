import { Logger as NestLogger } from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';


export class ExtendedNestLogger extends NestLogger {
  onModuleInit(): void {
    this.ensureLogsFolderExists();
    this.deleteOutdatedLogs();
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

    return `${process.env.LOG_PREFIX}${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}--${timeRange}.log`;
  }

  private deleteOutdatedLogs(): void {
    const currentDate = new Date();
    const files = fs.readdirSync(this.logsFolder, { withFileTypes: true });

    for (const file of files) {
      const fileFormatRegex = new RegExp(`${process.env.LOG_PREFIX}\\d{4}-\\d{2}-\\d{2}--\\d{2}-\\d{2}\\.log`);
      const fileName = file.name;

      if (fileFormatRegex.test(fileName)) {
        const dataRegex = new RegExp('\\d{4}-\\d{2}-\\d{2}');
        const data = fileName.match(dataRegex);

        if (data) {
          const dateParts = data[0].split('-');
          const specifiedDate = new Date(Number(dateParts[0]), parseInt(dateParts[1]) - 1, Number(dateParts[2]));

          const diffInMilliseconds = Math.abs(Number(currentDate) - Number(specifiedDate));
          const daysInMilliseconds = (Number(process.env.KEEP_LOGS_FOR_DAYS) + 1) * 24 * 60 * 60 * 1000;

          if (diffInMilliseconds >= daysInMilliseconds) {
            const filePath = path.join(process.cwd(), this.logsFolder, fileName);

            fs.unlinkSync(filePath);
          }
        }
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
