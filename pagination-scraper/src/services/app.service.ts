import { HttpService } from '@nestjs/axios';
import { HttpStatus, Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';

import { AxiosResponse } from 'axios';
import { config } from 'dotenv';

import { DelayService } from './delay.service';

import { getArrayIterator, LOGGER } from '../constants';
import { IAsyncArrayIterator } from '../types';


config();

@Injectable()
export class AppService {
  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly delayService: DelayService,
  ) {
    this.getCategoriesFromConfig();
  }

  private readonly baseUrl = this.configService.get('BASE_URL');
  private readonly prefix = this.configService.get('MCACHE_PREFIX');
  private categoriesToParse = [];

  private getCategoriesFromConfig(): void {
    let categoryIsValid = true;
    let iterator = 1;

    while (categoryIsValid) {
      const category = this.configService.get('URL_' + String(iterator));

      categoryIsValid = Boolean(category);

      if (categoryIsValid) {
        this.categoriesToParse.push(category);
      }

      iterator++;
    }
  }

  public getKeyByUrl(url: string): string {
    return this.prefix + url.replace(this.baseUrl, '');
  }

  @Cron(process.env.PAGINATION_SCRAPING_PERIOD, {
    name: 'pagination_scraping_task',
    timeZone: 'Asia/Nicosia',
  })
  public async parseIndexBySchedule() {
    this.logger.log('Function parseIndexBySchedule started.');
    const categoriesArrayIterator: IAsyncArrayIterator<string> = getArrayIterator(this.categoriesToParse);

    for await (const path of categoriesArrayIterator) {
      this.logger.log('Path: ' + path);
      await this.delayService.delayRequest();
    }
  }

  public async firstIndexParse() {

  }

  public async getPage(pageUrl: string): Promise<string | null> {
    try {
      const pageDataResponse: AxiosResponse = await this.httpService.axiosRef
        .get(pageUrl);

      if (pageDataResponse.status === HttpStatus.OK) {
        return pageDataResponse.data;
      }

      return null;
    } catch (e) {
      return null;
    }
  }
}
