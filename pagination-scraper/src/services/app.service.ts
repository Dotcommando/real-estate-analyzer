import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpStatus, Inject, Injectable, LoggerService, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, RmqRecord, RmqRecordBuilder } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';

import { AxiosResponse } from 'axios';
import { Cache } from 'cache-manager';
import { config } from 'dotenv';
import { catchError, of, take } from 'rxjs';

import { DelayService } from './delay.service';
import { ParseService } from './parse.service';

import { getArrayIterator, LOGGER, Messages, ServiceName } from '../constants';
import { IAsyncArrayIterator, ICategoriesData } from '../types';
import { getMillisecondsLeftUntilNewDay } from '../utils';


config();

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

  public async onModuleInit(): Promise<void> {
    await this.parseIndexBySchedule(1);
  }

  @Cron(process.env.PAGINATION_SCRAPING_PERIOD_0_2, {
    name: 'pagination_scraping_task_0_2',
    timeZone: 'Asia/Nicosia',
  })
  public async runner0to2(): Promise<void> {
    this.logger.log(' ');
    this.logger.log(' ');
    this.logger.log('Task for period 0:00 - 2:59 o\'clock started');

    return await this.parseIndexBySchedule(0);
  };

  @Cron(process.env.PAGINATION_SCRAPING_PERIOD_3_5, {
    name: 'pagination_scraping_task_3_5',
    timeZone: 'Asia/Nicosia',
  })
  public async runner3to5(): Promise<void> {
    this.logger.log(' ');
    this.logger.log(' ');
    this.logger.log('Task for period 3:00 - 5:59 o\'clock started');

    return await this.parseIndexBySchedule(0);
  };

  @Cron(process.env.PAGINATION_SCRAPING_PERIOD_6_8, {
    name: 'pagination_scraping_task_6_8',
    timeZone: 'Asia/Nicosia',
  })
  public async runner6to8(): Promise<void> {
    this.logger.log(' ');
    this.logger.log(' ');
    this.logger.log('Task for period 6:00 - 8:59 o\'clock started');

    return await this.parseIndexBySchedule(4);
  };

  @Cron(process.env.PAGINATION_SCRAPING_PERIOD_9_11, {
    name: 'pagination_scraping_task_9_11',
    timeZone: 'Asia/Nicosia',
  })
  public async runner9to11(): Promise<void> {
    this.logger.log(' ');
    this.logger.log(' ');
    this.logger.log('Task for period 9:00 - 11:59 o\'clock started');

    return await this.parseIndexBySchedule(1);
  };

  @Cron(process.env.PAGINATION_SCRAPING_PERIOD_12_14, {
    name: 'pagination_scraping_task_12_14',
    timeZone: 'Asia/Nicosia',
  })
  public async runner12to14(): Promise<void> {
    this.logger.log(' ');
    this.logger.log(' ');
    this.logger.log('Task for period 12:00 - 14:59 o\'clock started');

    return await this.parseIndexBySchedule(2);
  };

  @Cron(process.env.PAGINATION_SCRAPING_PERIOD_15_17, {
    name: 'pagination_scraping_task_15_17',
    timeZone: 'Asia/Nicosia',
  })
  public async runner15to17(): Promise<void> {
    this.logger.log(' ');
    this.logger.log(' ');
    this.logger.log('Task for period 15:00 - 17:59 o\'clock started');

    return await this.parseIndexBySchedule(1);
  };

  @Cron(process.env.PAGINATION_SCRAPING_PERIOD_18_20, {
    name: 'pagination_scraping_task_18_20',
    timeZone: 'Asia/Nicosia',
  })
  public async runner18to20(): Promise<void> {
    this.logger.log(' ');
    this.logger.log(' ');
    this.logger.log('Task for period 18:00 - 20:59 o\'clock started');

    return await this.parseIndexBySchedule(4);
  };

  @Cron(process.env.PAGINATION_SCRAPING_PERIOD_21_23, {
    name: 'pagination_scraping_task_21_23',
    timeZone: 'Asia/Nicosia',
  })
  public async runner21to23(): Promise<void> {
    this.logger.log(' ');
    this.logger.log(' ');
    this.logger.log('Task for period 21:00 - 23:59 o\'clock started');

    return await this.parseIndexBySchedule(4);
  };


  public async parseIndexBySchedule(maxPaginationNumber = 0) {
    try {
      const threadLocked = this.delayService.getThreadStatus();

      if (threadLocked) {
        return;
      }

      this.delayService.setThreadStatus(true);

      const categoriesIndexData: ICategoriesData = await this.visitPaginationPage(this.categoriesToParse, maxPaginationNumber);
      const adsPagesToVisitFromIndexPages: Set<string> = this.getAllUrlsFromCategoriesData('adsUrls', categoriesIndexData);
      const paginationToVisit: Set<string> = this.getAllUrlsFromCategoriesData('paginationUrls', categoriesIndexData);
      const categoriesInternalData: ICategoriesData = maxPaginationNumber === 1
        ? null
        : await this.visitPaginationPage(Array.from(paginationToVisit), maxPaginationNumber);
      const adsPagesToVisitFromInternalPages: Set<string> = this.getAllUrlsFromCategoriesData('adsUrls', categoriesInternalData);
      const allAdsPagesToVisit: Set<string> = new Set([ ...adsPagesToVisitFromIndexPages, ...adsPagesToVisitFromInternalPages ]);
      const nonCachedAdsPagesOnly: Set<string> = await this.getNonCachedUrls(allAdsPagesToVisit);

      let i = 0;
      let errorHappened = false;

      for (const url of nonCachedAdsPagesOnly) {
        if (i < 16) {
          if (i < 15) {
            this.logger.log(`URL ${ url } sent`);
          } else if (i === 15) {
            this.logger.log('...');
          }
        }

        const record: RmqRecord<string> = new RmqRecordBuilder(url)
          .build();

        this.client.send<unknown, RmqRecord>(Messages.PARSE_URL, record)
          .pipe(
            take(1),
            catchError(err => {
              if (!errorHappened) {
                errorHappened = true;
                this.logger.error('Error in \'parseIndexBySchedule\' method in RxJS pipe of client.send. ' + err);
              }

              return of(true);
            }),
          )
          .subscribe();

        i++;
      }

      this.logger.log(`New URLs to add: ${nonCachedAdsPagesOnly.size}, total: ${allAdsPagesToVisit.size}`);

      await this.addPagesToCache(nonCachedAdsPagesOnly);

      this.delayService.setThreadStatus(false);
    } catch (e) {
      this.logger.log('An error occurred in \'parseIndexBySchedule\' method.');
      this.logger.error(e.message);
      this.delayService.setThreadStatus(false);
    }
  }

  private async getNonCachedUrls(urlSet: Set<string> | string[]): Promise<Set<string>> {
    const urlArray = Array.from(urlSet);
    const urlArrayIterator: IAsyncArrayIterator<string> = getArrayIterator(urlArray);
    const result = new Set<string>();

    for await (const path of urlArrayIterator) {
      const cacheKey = this.getKeyByUrl(path);
      const fromCache = await this.cacheManager.get(cacheKey);

      if (!fromCache) {
        result.add(path);
      }
    }

    return result;
  }

  private async addPagesToCache(urlSet: Set<string> | string[]): Promise<Set<string>> {
    const urlArray = Array.from(urlSet);
    const urlArrayIterator: IAsyncArrayIterator<string> = getArrayIterator(urlArray);
    const result = new Set<string>();

    for await (const path of urlArrayIterator) {
      const cacheKey = this.getKeyByUrl(path);
      const addToCache = await this.cacheManager.set(cacheKey, true, getMillisecondsLeftUntilNewDay());

      result.add(path);
    }

    return result;
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
    if (from > to) {
      return new Set<string>();
    }

    const clearCategoryUrl = categoryUrl.replace(/[?&]{1}page=[\d]{1,}$/, '');
    const result = new Set<string>();
    const delimiter = clearCategoryUrl.substring(clearCategoryUrl.length - 1) === '/'
      ? ''
      : '/';

    for (let i = from; i <= to; i++) {
      result.add(`${clearCategoryUrl}${delimiter}?page=${i}`);
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

  getAllUrlsFromCategoriesData(setName: 'paginationUrls' | 'adsUrls', catData: ICategoriesData): Set<string> {
    if (!catData) {
      return new Set<string>();
    }

    let resultSet = new Set<string>();

    for (const path in catData) {
      resultSet = new Set([ ...resultSet, ...catData[path][setName] ]);
    }

    return resultSet;
  }

  public async visitPaginationPage(pages: string[], maxPaginationNumber = 0): Promise<ICategoriesData> {
    const paths = pages.map((pageUrl: string) => pageUrl.replace(this.baseUrl, ''));
    const categoriesArrayIterator: IAsyncArrayIterator<string> = getArrayIterator(paths);
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
        const setOfPaginationUrls: Set<string> = this.getPaginationUrlsSet(
          2,
          maxPaginationNumber === 0
            ? this.getMaxNumberOfPagination(paginationPageUrls)
            : maxPaginationNumber,
          categoryIndexURL,
        );

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
      this.logger.error(e);

      return null;
    }
  }
}
