import { Inject, Injectable, LoggerService, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';

import { config } from 'dotenv';
import { lastValueFrom, timeout } from 'rxjs';

import { CacheService } from './cache.service';
import { DbAccessService } from './db-access.service';
import { DbUrlRelationService } from './db-url-relation.service';
import { ProxyFactoryService } from './proxy-factory.service';

import { BazarakiAdPageParser, BazarakiPaginationParser } from '../classes';
import { LOGGER, UrlTypes, WebScraperMessages } from '../constants';
import { IRealEstate, ITcpResponse, IUrlData } from '../types';


config();

@Injectable()
export class AppService implements OnModuleInit {
  private webScraperClient: ClientProxy;
  private tcpTimeout = parseInt(this.configService.get<string>('TCP_TIMEOUT'));
  private firstRunDepth = this.configService.get('FIRST_RUN_DEPTH')
    ? parseInt(this.configService.get('FIRST_RUN_DEPTH'))
    : 0;
  private depthFull = this.configService.get('DEPTH_FULL')
    ? parseInt(this.configService.get('DEPTH_FULL'))
    : 0;
  private depthDeep = this.configService.get('DEPTH_DEEP')
    ? parseInt(this.configService.get('DEPTH_DEEP'))
    : 0;
  private depthModerate = this.configService.get('DEPTH_MODERATE')
    ? parseInt(this.configService.get('DEPTH_MODERATE'))
    : 0;
  private depthSuperficial = this.configService.get('DEPTH_SUPERFICIAL')
    ? parseInt(this.configService.get('DEPTH_SUPERFICIAL'))
    : 0;
  private depthShallow = this.configService.get('DEPTH_SHALLOW')
    ? parseInt(this.configService.get('DEPTH_SHALLOW'))
    : 0;

  private indexPagePriority = parseInt(this.configService.get('PRIORITY_INDEX_PAGE'));
  private paginationPagePriority = parseInt(this.configService.get('PRIORITY_PAGINATION_PAGE'));
  private adPagePriority = parseInt(this.configService.get('PRIORITY_AD_PAGE'));

  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService,
    private readonly cacheManager: CacheService,
    private readonly dbAccessService: DbAccessService,
    private readonly dbUrlRelationService: DbUrlRelationService,
    private readonly configService: ConfigService,
    private readonly proxyFactory: ProxyFactoryService,
  ) {
  }

  async onModuleInit(): Promise<void> {
    try {
      this.webScraperClient = this.proxyFactory.getClientProxy();

      await this.initScraping(this.firstRunDepth);
    } catch (e) {
      this.logger.error(' ');
      this.logger.error('Error occurred in AppService.onModuleInit');
      this.logger.error(e);
    }
  }

  private async initScraping(depth?: number): Promise<ITcpResponse<{ [url: string]: boolean }[]>> {
    const indexUrsToScrape: string[] = this.dbUrlRelationService.getUrlList();
    const tasksToScrape: IUrlData[] = indexUrsToScrape.map((url: string): IUrlData => ({
      priority: this.indexPagePriority,
      url,
      urlType: UrlTypes.Index,
      collection: this.dbUrlRelationService.getCollectionByUrl(url),
      depth: depth,
    }));

    return await this.sendTaskForWebScraper(tasksToScrape);
  }

  @Cron(process.env.CLEAR_CACHE, {
    name: 'clear_cache',
    timeZone: 'Asia/Nicosia',
  })
  public clearCache() {
    this.cacheManager.clear();
  }

  @Cron(process.env.PAGINATION_SCRAPING_FULL, {
    name: 'pagination_scraping_full',
    timeZone: 'Asia/Nicosia',
  })
  public async runnerFull(): Promise<ITcpResponse<{ [url: string]: boolean }[]>> {
    this.logger.log('Full scraping initialized');

    return await this.initScraping(this.depthFull);
  };

  @Cron(process.env.PAGINATION_SCRAPING_DEEP, {
    name: 'pagination_scraping_deep',
    timeZone: 'Asia/Nicosia',
  })
  public async runnerDeep(): Promise<ITcpResponse<{ [url: string]: boolean }[]>> {
    this.logger.log('Deep scraping initialized');

    return await this.initScraping(this.depthDeep);
  };

  @Cron(process.env.PAGINATION_SCRAPING_MODERATE, {
    name: 'pagination_scraping_moderate',
    timeZone: 'Asia/Nicosia',
  })
  public async runnerModerate(): Promise<ITcpResponse<{ [url: string]: boolean }[]>> {
    this.logger.log('Moderate scraping initialized');

    return await this.initScraping(this.depthModerate);
  };

  @Cron(process.env.PAGINATION_SCRAPING_SUPERFICIAL, {
    name: 'pagination_scraping_superficial',
    timeZone: 'Asia/Nicosia',
  })
  public async runnerSuperficial(): Promise<ITcpResponse<{ [url: string]: boolean }[]>> {
    this.logger.log('Superficial scraping initialized');

    return await this.initScraping(this.depthSuperficial);
  };

  @Cron(process.env.PAGINATION_SCRAPING_SHALLOW, {
    name: 'pagination_scraping_shallow',
    timeZone: 'Asia/Nicosia',
  })
  public async runnerShallow(): Promise<ITcpResponse<{ [url: string]: boolean }[]>> {
    this.logger.log('Shallow scraping initialized');

    return await this.initScraping(this.depthShallow);
  };

  public async sendTaskForWebScraper(data: IUrlData[]): Promise<ITcpResponse<{ [url: string]: boolean }[]>> {
    return await lastValueFrom(
      this.webScraperClient
        .send(WebScraperMessages.ADD_TO_PARSING_QUEUE, data)
        .pipe(timeout(this.tcpTimeout)),
    );
  }

  public async processIndexPage(dataToParse: string, urlData: IUrlData): Promise<void> {
    try {
      const parsedPagination: [ Set<string>, Set<string> ] = new BazarakiPaginationParser(dataToParse, urlData.url)
        .getPaginationAndAds();

      const maxPaginationNumber: number = this.getMaxNumberOfPagination(parsedPagination[0]);
      const depth: number = typeof urlData.depth === 'number' && !isNaN(urlData.depth)
        ? urlData.depth === 0
          ? maxPaginationNumber
          : Math.min(urlData.depth, maxPaginationNumber)
        : maxPaginationNumber;
      const categoryIndexURL: string = this.dbUrlRelationService.getUrlByCollection(urlData.collection);
      const setOfPaginationUrls: Set<string> = this.getPaginationUrlsSet(2, depth, categoryIndexURL);
      const adsPagesUrls: string[] = this.dbUrlRelationService.addBaseUrlToSetOfPaths(parsedPagination[1]);
      const paginationPagesTasks: IUrlData[] = Array.from(setOfPaginationUrls)
        .map((url: string) => ({
          priority: this.paginationPagePriority,
          url,
          urlType: UrlTypes.Pagination,
          collection: urlData.collection,
        }));
      const adsPagesTasks: IUrlData[] = adsPagesUrls
        .map((url: string) => ({
          priority: this.adPagePriority,
          url,
          urlType: UrlTypes.Ad,
          collection: urlData.collection,
        }));

      const paginationPagesNumber = paginationPagesTasks.length;
      const adsPagesNumber = adsPagesTasks.length;
      const indexPageProcessingResult: ITcpResponse<{ [url: string]: boolean }[]> = await this
        .sendTaskForWebScraper([ ...paginationPagesTasks, ...adsPagesTasks ]);
      let addedPaginationPagesToQueue = 0;
      let addedAdsPagesToQueue = 0;
      const resultLength = indexPageProcessingResult.data?.length ?? 0;

      this.logger.log(' ');
      this.logger.log('Index page processing result:');

      if (resultLength) {
        for (let i = 0; i < resultLength; i++) {
          if (i < paginationPagesNumber) {
            if (indexPageProcessingResult.data[i]) {
              addedPaginationPagesToQueue++;
            }
          } else {
            if (indexPageProcessingResult.data[i]) {
              addedAdsPagesToQueue++;
            }
          }
        }

        this.logger.log(`Pagination pages added to Queue ${ addedPaginationPagesToQueue } / ${ paginationPagesNumber }`);
        this.logger.log(`Ads pages added to Queue ${ addedAdsPagesToQueue } / ${ adsPagesNumber }`);
      } else {
        this.logger.log(`No Pagination pages added to Queue, sent ${ paginationPagesNumber }`);
        this.logger.log(`No Ads pages added to Queue, sent ${ adsPagesNumber }`);
      }
    } catch (e) {
      this.logger.error(' ');
      this.logger.error('Error occurred in AppService.processIndexPage');
      this.logger.error('urlData:');
      this.logger.error(urlData);
      this.logger.error(e);
    }
  }

  public async processPaginationPage(dataToParse: string, urlData: IUrlData): Promise<void> {
    try {
      const parsedAdUrls: Set<string> = new BazarakiPaginationParser(dataToParse, urlData.url).getAdsUrls();
      const adsPagesUrls: string[] = this.dbUrlRelationService.addBaseUrlToSetOfPaths(parsedAdUrls);
      const adsPagesTasks: IUrlData[] = adsPagesUrls
        .map((url: string) => ({
          priority: this.adPagePriority,
          url,
          urlType: UrlTypes.Ad,
          collection: urlData.collection,
        }));

      if (!adsPagesTasks.length) {
        return;
      }

      const adsPagesTasksNumber = adsPagesTasks.length;
      const paginationPageProcessingResult: ITcpResponse<{ [url: string]: boolean }[]> = await this
        .sendTaskForWebScraper(adsPagesTasks);

      this.logger.log(' ');
      this.logger.log('Pagination page processing result:');

      if (paginationPageProcessingResult.data?.length) {
        this.logger.log(`Ads pages added to Queue ${ paginationPageProcessingResult.data.filter(Boolean).length } / ${ adsPagesTasksNumber }`);
      } else {
        this.logger.log(`No ads pages added, sent ${adsPagesTasksNumber}.`);
      }
    } catch (e) {
      this.logger.error(' ');
      this.logger.error('Error occurred in AppService.processPaginationPage');
      this.logger.error('urlData:');
      this.logger.error(urlData);
      this.logger.error(e);
    }
  }

  public async processAdPage(dataToParse: string, urlData: IUrlData): Promise<void> {
    try {
      const parsedAdPage: Partial<IRealEstate> = new BazarakiAdPageParser(dataToParse, urlData.url).getPageData();
      const typeCastedPageData: Partial<IRealEstate> = this.dbAccessService.typecastingFields(parsedAdPage);

      await this.dbAccessService.saveNewAnnouncement(urlData.collection, typeCastedPageData);
    } catch (e) {
      this.logger.error(' ');
      this.logger.error('Error occurred in AppService.processAdPage');
      this.logger.error('urlData:');
      this.logger.error(urlData);
      this.logger.error(e);
    }
  }

  private getMaxNumberOfPagination(setOfUrls: Set<string>): number {
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

  private getPaginationUrlsSet(from: number, to: number, categoryUrl: string): Set<string> {
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
}
