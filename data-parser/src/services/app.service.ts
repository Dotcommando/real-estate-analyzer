import { Inject, Injectable, LoggerService, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';

import { config } from 'dotenv';
import { lastValueFrom, timeout } from 'rxjs';

import { AdProcessingStatus, DbAccessService } from './db-access.service';
import { DbUrlRelationService } from './db-url-relation.service';
import { ProxyFactoryService } from './proxy-factory.service';

import { BazarakiAdPageParser, BazarakiPaginationParser } from '../classes';
import { LOGGER, UrlTypes, WebScraperMessages } from '../constants';
import { IAdDBOperationResult, IAddToQueueResult, IRealEstate, ITcpResponse, IUrlData } from '../types';
import { dateInHumanReadableFormat } from '../utils';


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
  private doNotRunFirst = this.configService.get('DO_NOT_RUN_FIRST') === 'true';
  private doNotRunFull = this.configService.get('DO_NOT_RUN_FULL') === 'true';
  private doNotRunDeep = this.configService.get('DO_NOT_RUN_DEEP') === 'true';
  private doNotRunModerate = this.configService.get('DO_NOT_RUN_MODERATE') === 'true';
  private doNotRunSuperficial = this.configService.get('DO_NOT_RUN_SUPERFICIAL') === 'true';
  private doNotRunShallow = this.configService.get('DO_NOT_RUN_SHALLOW') === 'true';

  private indexPagePriority = parseInt(this.configService.get('PRIORITY_INDEX_PAGE'));
  private paginationPagePriority = parseInt(this.configService.get('PRIORITY_PAGINATION_PAGE'));
  private adPagePriority = parseInt(this.configService.get('PRIORITY_AD_PAGE'));
  private sourceUrl = this.configService.get('SOURCE_URL');

  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService,
    private readonly dbAccessService: DbAccessService,
    private readonly dbUrlRelationService: DbUrlRelationService,
    private readonly configService: ConfigService,
    private readonly proxyFactory: ProxyFactoryService,
  ) {
  }

  async onModuleInit(): Promise<void> {
    try {
      this.webScraperClient = this.proxyFactory.getClientProxy();

      if (!this.doNotRunFirst) {
        await this.initScraping(this.firstRunDepth);
      }
    } catch (e) {
      await this.logger.error(' ');
      await this.logger.error('Error occurred in AppService.onModuleInit');
      await this.logger.error(e);
    }
  }

  private async initScraping(depth?: number): Promise<ITcpResponse<{ [url: string]: IAddToQueueResult }>> {
    const indexUrsToScrape: string[] = this.dbUrlRelationService.getUrlList();
    const tasksToScrape: IUrlData[] = indexUrsToScrape.map((url: string): IUrlData => ({
      priority: this.indexPagePriority,
      url,
      urlType: UrlTypes.Index,
      collection: this.dbUrlRelationService.getCollectionByUrl(url),
      depth,
    }));

    return await this.sendTaskForWebScraper(tasksToScrape);
  }

  @Cron(process.env.PAGINATION_SCRAPING_FULL, {
    name: 'pagination_scraping_full',
    utcOffset: 180,
  })
  public async runnerFull(): Promise<ITcpResponse<{ [url: string]: IAddToQueueResult }> | void> {
    if (this.doNotRunFull) {
      return;
    }

    return await this.initScraping(this.depthFull);
  };

  @Cron(process.env.PAGINATION_SCRAPING_DEEP, {
    name: 'pagination_scraping_deep',
    utcOffset: 180,
  })
  public async runnerDeep(): Promise<ITcpResponse<{ [url: string]: IAddToQueueResult }> | void> {
    if (this.doNotRunDeep) {
      return;
    }

    return await this.initScraping(this.depthDeep);
  };

  @Cron(process.env.PAGINATION_SCRAPING_MODERATE, {
    name: 'pagination_scraping_moderate',
    utcOffset: 180,
  })
  public async runnerModerate(): Promise<ITcpResponse<{ [url: string]: IAddToQueueResult }> | void> {
    if (this.doNotRunModerate) {
      return;
    }

    return await this.initScraping(this.depthModerate);
  };

  @Cron(process.env.PAGINATION_SCRAPING_SUPERFICIAL, {
    name: 'pagination_scraping_superficial',
    utcOffset: 180,
  })
  public async runnerSuperficial(): Promise<ITcpResponse<{ [url: string]: IAddToQueueResult }> | void> {
    if (this.doNotRunSuperficial) {
      return;
    }

    return await this.initScraping(this.depthSuperficial);
  };

  @Cron(process.env.PAGINATION_SCRAPING_SHALLOW, {
    name: 'pagination_scraping_shallow',
    utcOffset: 180,
  })
  public async runnerShallow(): Promise<ITcpResponse<{ [url: string]: IAddToQueueResult }> | void> {
    if (this.doNotRunShallow) {
      return;
    }

    return await this.initScraping(this.depthShallow);
  };

  public async sendTaskForWebScraper(data: IUrlData[]): Promise<ITcpResponse<{ [url: string]: IAddToQueueResult }>> {
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

      const tasks: IUrlData[] = [ ...paginationPagesTasks, ...adsPagesTasks ];
      const indexPageProcessingResult: ITcpResponse<{ [url: string]: IAddToQueueResult }> = await this
        .sendTaskForWebScraper(tasks);

      this.logger.log(' ');
      this.logger.log(`\x1b[36m${dateInHumanReadableFormat(new Date(), 'DD.MM.YYYY HH:mm:ss')} Index ${urlData.url.replace(this.sourceUrl, '')}\x1b[0m`);

      for (const key in indexPageProcessingResult.data) {
        this.logger.log(`  ${key.replace(this.sourceUrl, '')}: ${indexPageProcessingResult.data[key].added ? 'added' : 'not added'}${indexPageProcessingResult.data[key].reason ? ' ' + indexPageProcessingResult.data[key].reason : ''}`);
      }
    } catch (e) {
      await this.logger.error(' ');
      await this.logger.error('Error occurred in AppService.processIndexPage');
      await this.logger.error('urlData:');
      await this.logger.error(urlData);
      await this.logger.error(e);
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

      const paginationPageProcessingResult: ITcpResponse<{ [url: string]: IAddToQueueResult }> = await this
        .sendTaskForWebScraper(adsPagesTasks);

      this.logger.log(' ');
      this.logger.log(`\x1b[32m${dateInHumanReadableFormat(new Date(), 'DD.MM.YYYY HH:mm:ss')} Pagination ${urlData.url.replace(this.sourceUrl, '')}\x1b[0m`);

      for (const key in paginationPageProcessingResult.data) {
        this.logger.log(`  ${key.replace(this.sourceUrl, '')}: ${paginationPageProcessingResult.data[key].added ? 'added' : 'not added'}${paginationPageProcessingResult.data[key].reason ? ' ' + paginationPageProcessingResult.data[key].reason : ''}`);
      }
    } catch (e) {
      await this.logger.error(' ');
      await this.logger.error('Error occurred in AppService.processPaginationPage');
      await this.logger.error('urlData:');
      await this.logger.error(urlData);
      await this.logger.error(e);
    }
  }

  private getStatusColor(status: AdProcessingStatus | string): string {
    switch (status) {
      case AdProcessingStatus.ERROR:
        return '\x1b[31m';

      case AdProcessingStatus.NO_CHANGES:
        return '\x1b[90m';

      case AdProcessingStatus.ADDED:
        return '\x1b[32m';

      case AdProcessingStatus.ACTIVE_DATE_ADDED:
        return '\x1b[35m';

      default:
        return '\x1b[90m';
    }
  }

  public async processAdPage(dataToParse: string, urlData: IUrlData): Promise<void> {
    try {
      const parsedAdPage: Partial<IRealEstate> = new BazarakiAdPageParser(dataToParse, urlData.url).getPageData();
      const typeCastedPageData: Partial<IRealEstate> = this.dbAccessService.typecastingFields(parsedAdPage);
      const saveAdResult: IAdDBOperationResult = await this.dbAccessService.saveNewAnnouncement(urlData.collection, typeCastedPageData);

      this.logger.log(`${dateInHumanReadableFormat(new Date(), 'DD.MM.YYYY HH:mm:ss')} Saving result to DB: \x1b[33m${urlData.url.replace(this.sourceUrl, '')}\x1b[0m ${this.getStatusColor(saveAdResult.status)}${saveAdResult.status}\x1b[0m`);
    } catch (e) {
      await this.logger.error(' ');
      await this.logger.error('Error occurred in AppService.processAdPage');
      await this.logger.error('urlData:');
      await this.logger.error(urlData);
      await this.logger.error(e);
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
