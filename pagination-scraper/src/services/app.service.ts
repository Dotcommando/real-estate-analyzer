import { HttpService } from '@nestjs/axios';
import { HttpStatus, Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, RmqRecord, RmqRecordBuilder } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';

import { AxiosResponse } from 'axios';
import { config } from 'dotenv';
import { catchError, of, take } from 'rxjs';

import { DelayService } from './delay.service';
import { ParseService } from './parse.service';

import { getArrayIterator, LOGGER, Messages, ServiceName } from '../constants';
import { IAsyncArrayIterator, ICategoriesData } from '../types';


config();

@Injectable()
export class AppService {
  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService,
    @Inject(ServiceName) private client: ClientProxy,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly delayService: DelayService,
    private readonly parseService: ParseService,
  ) {
    this.getCategoriesFromConfig();
  }

  private readonly baseUrl = this.configService.get('BASE_URL');
  private readonly prefix = this.configService.get('MCACHE_PREFIX');
  private categoriesToParse = [];

  @Cron(process.env.PAGINATION_SCRAPING_PERIOD, {
    name: 'pagination_scraping_task',
    timeZone: 'Asia/Nicosia',
  })
  public async parseIndexBySchedule() {
    try {
      const categoriesIndexData: ICategoriesData = await this.visitPaginationPage(this.categoriesToParse);
      const adsPagesToVisit = this.getAllUrlsFromCategoriesData('adsUrls', categoriesIndexData);

      for (const url of adsPagesToVisit) {
        this.logger.log(`URL ${ url } sent`);

        const record: RmqRecord<string> = new RmqRecordBuilder(url)
          .build();

        this.client.send<unknown, RmqRecord>(Messages.PARSE_URL, record)
          .pipe(
            take(1),
            catchError(err => {
              this.logger.error('Error in \'parseIndexBySchedule\' method in RxJS pipe of client.send.');
              this.logger.error(err);

              return of(true);
            }),
          );
      }
    } catch (e) {
      this.logger.log('An error occurred in \'parseIndexBySchedule\' method.');
      this.logger.error(e.message);
    }
  }

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

  public getMaxNumberOfPagination(setOfUrls: Set<string>): number {
    if (!setOfUrls.size) {
      return 0;
    }

    try {
      const arrayOfUrls = Array.from(setOfUrls);
      const maxPageNumber = arrayOfUrls.reduce((prev: number, curr: string) => {
        const currPageNumberString = Number(curr.match(/[\d]*$/)?.[0]);
        const currPageNumber = !isNaN(currPageNumberString)
          ? Number(currPageNumberString)
          : 0;

        return Math.max(prev, currPageNumber);
      }, 0);

      return isNaN(maxPageNumber) ? 0 : maxPageNumber;
    } catch (e) {
      this.logger.error('Error happened in \'getMaxNumberOfPagination\' method of app.service.ts');
      this.logger.error(e);

      return 0;
    }
  }

  public getPaginationUrlsSet(from: number, to: number, categoryUrl: string): Set<string> {
    const result = new Set<string>();
    const delimiter = categoryUrl.substring(categoryUrl.length - 1) === '/'
      ? ''
      : '/';

    for (let i = from; i <= to; i++) {
      result.add(`${categoryUrl}${delimiter}?page=${i}`);
    }

    return result;
  }

  public addBaseUrl(baseUrl: string, urlSet: Set<string>): Set<string> {
    if (urlSet.size === 0) {
      return new Set<string>();
    }

    const baseUrlEndedWithSlash = baseUrl.substring(baseUrl.length - 1) === '/';
    const arr = Array.from(urlSet);
    const result = new Set<string>();

    for (const path of arr) {
      const urlStartedWithSlash = path.substring(0, 1) === '/';

      if (path.startsWith(baseUrl)) {
        result.add(path);
      } else if ((!baseUrlEndedWithSlash && urlStartedWithSlash) || (baseUrlEndedWithSlash && !urlStartedWithSlash)) {
        result.add(baseUrl + path);
      } else if (!baseUrlEndedWithSlash && !urlStartedWithSlash) {
        result.add(baseUrl + '/' + path);
      }
    }

    return result;
  }

  getAllUrlsFromCategoriesData(setName: 'paginationUrls' | 'adsUrls', catData: ICategoriesData) {
    let resultSet = new Set<string>();

    for (const path in catData) {
      resultSet = new Set([ ...resultSet, ...catData[path][setName] ]);
    }

    return resultSet;
  }

  public async visitPaginationPage(pages: string[]): Promise<ICategoriesData> {
    const categoriesArrayIterator: IAsyncArrayIterator<string> = getArrayIterator(pages);
    const categoriesData = {};

    for await (const path of categoriesArrayIterator) {
      const categoryIndexURL = this.baseUrl + path;
      const pageData = await this.getPage(categoryIndexURL);

      this.logger.log(' ');
      this.logger.log('Parsing of: ' + path);

      if (pageData) {
        await this.delayService.delayRequest();

        const [ paginationPageUrls, adsUrls ] = await this.parseService
          .parsePage(pageData, categoryIndexURL);
        const maxPaginationNumber = this.getMaxNumberOfPagination(paginationPageUrls);
        const setOfPaginationUrls = this.getPaginationUrlsSet(2, maxPaginationNumber, categoryIndexURL);

        categoriesData[path] = {
          paginationUrls: setOfPaginationUrls,
          adsUrls: this.addBaseUrl(this.baseUrl, adsUrls),
        };

      } else {
        this.logger.log('Failed to fetch page: ' + categoryIndexURL);
      }
    }

    return categoriesData;
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
