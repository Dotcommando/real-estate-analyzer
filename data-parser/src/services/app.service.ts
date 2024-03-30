import { Inject, Injectable, LoggerService, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';

import { config } from 'dotenv';
import { lastValueFrom, timeout } from 'rxjs';

import { DbAccessService } from './db-access.service';
import { DbUrlRelationService } from './db-url-relation.service';

import {
  AdPageParserAbstract,
  PaginationParserAbstract,
} from '../classes';
import { AdProcessingStatus, LOGGER, UrlTypes, WebScraperMessages } from '../constants';
import { ParserFactory, ProxyFactory } from '../factories';
import {
  IAdDBOperationResult,
  IAddToQueueResult,
  IRealEstate,
  ITask,
  ITcpResponse,
} from '../types';
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
  private adPagePriority = this.getPriorityNumber('PRIORITY_AD_PAGE', 10);

  private adPageFirstRunPriority = this.getPriorityNumber('PRIORITY_AD_PAGE_FIRST_RUN', this.adPagePriority);
  private adPageFullPriority = this.getPriorityNumber('PRIORITY_AD_PAGE_FULL', this.adPagePriority);
  private adPageDeepPriority = this.getPriorityNumber('PRIORITY_AD_PAGE_DEEP', this.adPagePriority);
  private adPageModeratePriority = this.getPriorityNumber('PRIORITY_AD_PAGE_MODERATE', this.adPagePriority);
  private adPageSuperficialPriority = this.getPriorityNumber('PRIORITY_AD_PAGE_SUPERFICIAL', this.adPagePriority);
  private adPageShallowPriority = this.getPriorityNumber('PRIORITY_AD_PAGE_SHALLOW', this.adPagePriority);

  private sourceUrl = this.configService.get('SOURCE_URL');
  private queueName = this.configService.get('QUEUE_NAME');
  private host = this.configService.get('DATA_PARSER_SERVICE_HOST');
  private port = this.configService.get('DATA_PARSER_SERVICE_PORT');

  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService,
    private readonly dbAccessService: DbAccessService,
    private readonly dbUrlRelationService: DbUrlRelationService,
    private readonly configService: ConfigService,
    private readonly parserFactory: ParserFactory,
    private readonly proxyFactory: ProxyFactory,
  ) {
  }

  async onModuleInit(): Promise<void> {
    try {
      this.webScraperClient = this.proxyFactory.getClientProxy();

      if (!this.doNotRunFirst) {
        await this.initScraping(this.firstRunDepth, this.adPageFirstRunPriority);
      }
    } catch (e) {
      await this.logger.error(' ');
      await this.logger.error('Error occurred in AppService.onModuleInit');
      await this.logger.error(e);
    }
  }

  private getPriorityNumber(envVariableName: string, defaultPriority = 0): number {
    try {
      const priority = parseInt(this.configService.get(envVariableName));

      return !isNaN(priority)
        ? priority
        : defaultPriority;
    } catch (e) {
      return defaultPriority;
    }
  }

  private async initScraping(
    depth: number,
    adPriority?: number,
  ): Promise<ITcpResponse<{ [url: string]: IAddToQueueResult }>> {
    const indexUrsToScrape: string[] = this.dbUrlRelationService.getUrlList();
    const tasksToScrape: ITask[] = indexUrsToScrape.map((url: string): ITask => ({
      priority: this.indexPagePriority,
      ...(typeof adPriority === 'number' && { adPriority }),
      url,
      urlType: UrlTypes.Index,
      collection: this.dbUrlRelationService.getCollectionByUrl(url),
      depth,
      queueName: this.queueName,
      host: this.host,
      port: this.port,
    }));

    return await this.sendTaskForWebScraper(tasksToScrape);
  }

  @Cron(process.env.PAGINATION_SCRAPING_FULL, {
    name: 'pagination_scraping_full',
    timeZone: process.env.TZ,
  })
  public async runnerFull(): Promise<ITcpResponse<{ [url: string]: IAddToQueueResult }> | void> {
    if (this.doNotRunFull) {
      return;
    }

    return await this.initScraping(this.depthFull, this.adPageFullPriority);
  };

  @Cron(process.env.PAGINATION_SCRAPING_DEEP, {
    name: 'pagination_scraping_deep',
    timeZone: process.env.TZ,
  })
  public async runnerDeep(): Promise<ITcpResponse<{ [url: string]: IAddToQueueResult }> | void> {
    if (this.doNotRunDeep) {
      return;
    }

    return await this.initScraping(this.depthDeep, this.adPageDeepPriority);
  };

  @Cron(process.env.PAGINATION_SCRAPING_MODERATE, {
    name: 'pagination_scraping_moderate',
    timeZone: process.env.TZ,
  })
  public async runnerModerate(): Promise<ITcpResponse<{ [url: string]: IAddToQueueResult }> | void> {
    if (this.doNotRunModerate) {
      return;
    }

    return await this.initScraping(this.depthModerate, this.adPageModeratePriority);
  };

  @Cron(process.env.PAGINATION_SCRAPING_SUPERFICIAL, {
    name: 'pagination_scraping_superficial',
    timeZone: process.env.TZ,
  })
  public async runnerSuperficial(): Promise<ITcpResponse<{ [url: string]: IAddToQueueResult }> | void> {
    if (this.doNotRunSuperficial) {
      return;
    }

    return await this.initScraping(this.depthSuperficial, this.adPageSuperficialPriority);
  };

  @Cron(process.env.PAGINATION_SCRAPING_SHALLOW, {
    name: 'pagination_scraping_shallow',
    timeZone: process.env.TZ,
  })
  public async runnerShallow(): Promise<ITcpResponse<{ [url: string]: IAddToQueueResult }> | void> {
    if (this.doNotRunShallow) {
      return;
    }

    return await this.initScraping(this.depthShallow, this.adPageShallowPriority);
  };

  public async sendTaskForWebScraper(tasks: ITask[]): Promise<ITcpResponse<{ [url: string]: IAddToQueueResult }>> {
    return await lastValueFrom(
      this.webScraperClient
        .send(WebScraperMessages.ADD_TO_PARSING_QUEUE, tasks)
        .pipe(timeout(this.tcpTimeout)),
    );
  }

  public async processIndexPage(dataToParse: string, task: ITask): Promise<void> {
    try {
      const paginationParser: PaginationParserAbstract = this.parserFactory.createPaginationParser(dataToParse, task.url);
      const parsedPagination: [ Set<string>, Set<string> ] = paginationParser.getPaginationAndAds();
      const maxPaginationNumber: number = paginationParser.getMaxNumberOfPagination(parsedPagination[0]);
      const depth: number = typeof task.depth === 'number' && !isNaN(task.depth)
        ? task.depth === 0
          ? maxPaginationNumber
          : Math.min(task.depth, maxPaginationNumber)
        : maxPaginationNumber;
      const categoryIndexURL: string = this.dbUrlRelationService.getUrlByCollection(task.collection);
      const setOfPaginationUrls: Set<string> = paginationParser.getPaginationUrlsSet(2, depth, categoryIndexURL);
      const adsPagesUrls: string[] = this.dbUrlRelationService.addBaseUrlToSetOfPaths(parsedPagination[1]);
      const paginationPagesTasks: ITask[] = Array.from(setOfPaginationUrls)
        .map((url: string) => ({
          priority: this.paginationPagePriority,
          ...(typeof task.adPriority === 'number' && { adPriority: task.adPriority }),
          url,
          urlType: UrlTypes.Pagination,
          collection: task.collection,
          queueName: this.queueName,
          host: task.host,
          port: task.port,
        }));
      const adsPagesTasks: ITask[] = adsPagesUrls
        .map((url: string) => ({
          priority: typeof task.adPriority === 'number'
            ? task.adPriority      // 1st place, where `adPriority` becomes `priority`
            : this.adPagePriority,
          url,
          urlType: UrlTypes.Ad,
          collection: task.collection,
          queueName: this.queueName,
          host: task.host,
          port: task.port,
        }));

      const tasks: ITask[] = [ ...paginationPagesTasks, ...adsPagesTasks ];
      const indexPageProcessingResult: ITcpResponse<{ [url: string]: IAddToQueueResult }> = await this
        .sendTaskForWebScraper(tasks);

      this.logger.log(' ');
      this.logger.log(`\x1b[36m${dateInHumanReadableFormat(new Date(), 'DD.MM.YYYY HH:mm:ss')} Index ${task.url.replace(this.sourceUrl, '')}\x1b[0m`);

      for (const key in indexPageProcessingResult.data) {
        this.logger.log(`  ${key.replace(this.sourceUrl, '')}: ${indexPageProcessingResult.data[key].added ? 'added' : 'not added'}${indexPageProcessingResult.data[key].reason ? '. ' + indexPageProcessingResult.data[key].reason : ''}`);
      }
    } catch (e) {
      await this.logger.error(' ');
      await this.logger.error('Error occurred in AppService.processIndexPage');
      await this.logger.error('task:');
      await this.logger.error(task);
      await this.logger.error(e);
    }
  }

  public async processPaginationPage(dataToParse: string, task: ITask): Promise<void> {
    try {
      const paginationParser: PaginationParserAbstract = this.parserFactory.createPaginationParser(dataToParse, task.url);
      const parsedAdUrls: Set<string> = paginationParser.getAdsUrls();
      const adsPagesUrls: string[] = this.dbUrlRelationService.addBaseUrlToSetOfPaths(parsedAdUrls);
      const adsPagesTasks: ITask[] = adsPagesUrls
        .map((url: string) => ({
          priority: typeof task.adPriority === 'number'
            ? task.adPriority      // 2nd place, where `adPriority` becomes `priority`
            : this.adPagePriority,
          url,
          urlType: UrlTypes.Ad,
          collection: task.collection,
          queueName: this.queueName,
          host: this.host,
          port: this.port,
        }));

      if (!adsPagesTasks.length) {
        return;
      }

      const paginationPageProcessingResult: ITcpResponse<{ [url: string]: IAddToQueueResult }> = await this
        .sendTaskForWebScraper(adsPagesTasks);

      this.logger.log(' ');
      this.logger.log(`\x1b[32m${dateInHumanReadableFormat(new Date(), 'DD.MM.YYYY HH:mm:ss')} Pagination ${task.url.replace(this.sourceUrl, '')}\x1b[0m`);

      for (const key in paginationPageProcessingResult.data) {
        this.logger.log(`  ${key.replace(this.sourceUrl, '')}: ${paginationPageProcessingResult.data[key].added ? 'added' : 'not added'}${paginationPageProcessingResult.data[key].reason ? '. ' + paginationPageProcessingResult.data[key].reason : ''}`);
      }
    } catch (e) {
      await this.logger.error(' ');
      await this.logger.error('Error occurred in AppService.processPaginationPage');
      await this.logger.error('task:');
      await this.logger.error(task);
      await this.logger.error(e);
    }
  }

  private getStatusColor(status: AdProcessingStatus | string): string {
    switch (status) {
      case AdProcessingStatus.ERROR:
        return '\x1b[31m';

      case AdProcessingStatus.NO_CHANGES:
        return '\x1b[90m';

      case AdProcessingStatus.SAVED:
        return '\x1b[32m';

      case AdProcessingStatus.ACTIVE_DATE_ADDED:
        return '\x1b[35m';

      default:
        return '\x1b[90m';
    }
  }

  public async processAdPage(dataToParse: string, task: ITask): Promise<void> {
    try {
      const adParser: AdPageParserAbstract<IRealEstate> = this.parserFactory.createAdPageParser(dataToParse, task.url, task.collection);
      const parsedAdPage: Partial<IRealEstate> = adParser.getPageData();

      if (parsedAdPage.expired) {
        this.logger.log(`${dateInHumanReadableFormat(new Date(), 'DD.MM.YYYY HH:mm:ss')} Saving result to DB: \x1b[33m${task.url.replace(this.sourceUrl, '')}\x1b[0m ${this.getStatusColor(AdProcessingStatus.NO_CHANGES)}${AdProcessingStatus.EXPIRED_REJECTED}\x1b[0m`);

        return;
      }

      const typeCastedPageData: Partial<IRealEstate> = this.dbAccessService.typecastingFields(parsedAdPage);
      const saveAdResult: IAdDBOperationResult = await this.dbAccessService.saveNewAnnouncement(task.collection, typeCastedPageData);

      if ('errorMsg' in saveAdResult) {
        this.logger.error(saveAdResult['errorMsg']);
      }

      this.logger.log(`${dateInHumanReadableFormat(new Date(), 'DD.MM.YYYY HH:mm:ss')} Saving result to DB: \x1b[33m${task.url.replace(this.sourceUrl, '')}\x1b[0m ${this.getStatusColor(saveAdResult.status)}${saveAdResult.status}\x1b[0m`);
    } catch (e) {
      await this.logger.error(' ');
      await this.logger.error('Error occurred in AppService.processAdPage');
      await this.logger.error('task:');
      await this.logger.error(task);
      await this.logger.error(e);
    }
  }
}
