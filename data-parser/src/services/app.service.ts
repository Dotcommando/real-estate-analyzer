import { Inject, Injectable, LoggerService, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';

import { config } from 'dotenv';
import { lastValueFrom, timeout } from 'rxjs';

import { AdProcessingStatus, DbAccessService } from './db-access.service';
import { DbUrlRelationService } from './db-url-relation.service';
import { DynamicLoggerService } from './dynamic-logger.service';
import { ProxyFactoryService } from './proxy-factory.service';
import {
  AddToQueueEvent,
  ProcessingEvent,
  RunEvent,
  StatEvent,
  STATISTIC_EVENT,
  StatisticCollectorService,
} from './statistic-collector.service';

import { BazarakiAdPageParser, BazarakiPaginationParser } from '../classes';
import { LOGGER, UrlTypes, WebScraperMessages } from '../constants';
import { IAdDBOperationResult, IRealEstate, ITcpResponse, IUrlData } from '../types';
import { dateInHumanReadableFormat, getArrayIterator } from '../utils';


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
  private collectionList = JSON.parse(this.configService.get('MONGO_COLLECTIONS'));

  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService,
    private readonly dynamicLogger: DynamicLoggerService,
    private readonly dbAccessService: DbAccessService,
    private readonly dbUrlRelationService: DbUrlRelationService,
    private readonly configService: ConfigService,
    private readonly proxyFactory: ProxyFactoryService,
    private readonly statisticCollector: StatisticCollectorService,
  ) {
    this.print = this.print.bind(this);
  }

  public async print(id: string, msg: string): Promise<void> {
    await this.dynamicLogger.write(id, msg);
  }

  async onModuleInit(): Promise<void> {
    try {
      this.webScraperClient = this.proxyFactory.getClientProxy();

      if (!this.doNotRunFirst) {
        await this.initScraping(this.firstRunDepth);
      }

      this.statisticCollector.add({
        type: STATISTIC_EVENT.RUN,
        ok: true,
        runType: 'first_run',
      } as Omit<RunEvent, 'dateMsec'>);
    } catch (e) {
      await this.logger.error(' ');
      await this.logger.error('Error occurred in AppService.onModuleInit');
      await this.logger.error(e);
    }
  }

  private async initScraping(depth?: number): Promise<ITcpResponse<boolean[]>> {
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

  @Cron(process.env.PAGINATION_SCRAPING_FULL, {
    name: 'pagination_scraping_full',
    utcOffset: 180,
  })
  public async runnerFull(): Promise<ITcpResponse<boolean[]> | void> {
    if (this.doNotRunFull) {
      return;
    }

    this.statisticCollector.add({
      type: STATISTIC_EVENT.RUN,
      ok: true,
      runType: 'full',
    } as Omit<RunEvent, 'dateMsec'>);

    return await this.initScraping(this.depthFull);
  };

  @Cron(process.env.PAGINATION_SCRAPING_DEEP, {
    name: 'pagination_scraping_deep',
    utcOffset: 180,
  })
  public async runnerDeep(): Promise<ITcpResponse<boolean[]> | void> {
    if (this.doNotRunDeep) {
      return;
    }

    this.statisticCollector.add({
      type: STATISTIC_EVENT.RUN,
      ok: true,
      runType: 'deep',
    } as Omit<RunEvent, 'dateMsec'>);

    return await this.initScraping(this.depthDeep);
  };

  @Cron(process.env.PAGINATION_SCRAPING_MODERATE, {
    name: 'pagination_scraping_moderate',
    utcOffset: 180,
  })
  public async runnerModerate(): Promise<ITcpResponse<boolean[]> | void> {
    if (this.doNotRunModerate) {
      return;
    }

    this.statisticCollector.add({
      type: STATISTIC_EVENT.RUN,
      ok: true,
      runType: 'moderate',
    } as Omit<RunEvent, 'dateMsec'>);

    return await this.initScraping(this.depthModerate);
  };

  @Cron(process.env.PAGINATION_SCRAPING_SUPERFICIAL, {
    name: 'pagination_scraping_superficial',
    utcOffset: 180,
  })
  public async runnerSuperficial(): Promise<ITcpResponse<boolean[]> | void> {
    if (this.doNotRunSuperficial) {
      return;
    }

    this.statisticCollector.add({
      type: STATISTIC_EVENT.RUN,
      ok: true,
      runType: 'superficial',
    } as Omit<RunEvent, 'dateMsec'>);

    return await this.initScraping(this.depthSuperficial);
  };

  @Cron(process.env.PAGINATION_SCRAPING_SHALLOW, {
    name: 'pagination_scraping_shallow',
    utcOffset: 180,
  })
  public async runnerShallow(): Promise<ITcpResponse<boolean[]> | void> {
    if (this.doNotRunShallow) {
      return;
    }

    this.statisticCollector.add({
      type: STATISTIC_EVENT.RUN,
      ok: true,
      runType: 'shallow',
    } as Omit<RunEvent, 'dateMsec'>);

    return await this.initScraping(this.depthShallow);
  };

  @Cron('0 0 * * *', {
    name: 'purge_old_events',
    utcOffset: 180,
  })
  public purgeOldEvents(): void {
    this.statisticCollector.purgeOldEvents(3);
  }

  @Cron('* * * * *', {
    name: 'print_stat',
    utcOffset: 180,
  })
  public async printStat(): Promise<void> {
    const eventsStat: Array<{ events: { [key: string]: StatEvent[] }; date: Date }> = this.statisticCollector
      .getEventsByDays(2);
    const dayAsyncIterator = getArrayIterator(eventsStat);

    let dayIterationStep = 0;

    for await (const dayEvents of dayAsyncIterator) {
      const humanReadableDate = dateInHumanReadableFormat(dayEvents.date, 'DD.MM.YYYY');

      await this.print(`day_${dayIterationStep}_break-line_1`, ' ');
      await this.print(`day_${dayIterationStep}_break-line_2`, ' ');
      await this.print(`day_${dayIterationStep}_break-line_3`, ' ');
      await this.print(`day_${dayIterationStep}`, humanReadableDate);

      const hourEventArray: StatEvent[][] = [];

      for (let i = 0; i < 24; i++) {
        hourEventArray.push(dayEvents.events[String(i)]);
      }

      const hourAsyncIterator = getArrayIterator(hourEventArray);
      let hourIterationStep = 0;

      for await (const hourEvents of hourAsyncIterator) {
        const hour = String(hourIterationStep).length === 1 ? '0' + String(hourIterationStep) : String(hourIterationStep);

        await this.print(`day_${dayIterationStep}_hour_${hourIterationStep}_line-break_1`, ' ');
        await this.print(`day_${dayIterationStep}_hour_${hourIterationStep}`, `${hour}:00 - ${hour}:59`);

        const fullRun: StatEvent[] = hourEvents
          .filter((ev: StatEvent) => ev.type === STATISTIC_EVENT.RUN && ev.runType === 'full');
        const shallowRun: StatEvent[] = hourEvents
          .filter((ev: StatEvent) => ev.type === STATISTIC_EVENT.RUN && ev.runType === 'shallow');

        await this.print(`day_${dayIterationStep}_hour_${hourIterationStep}_run`, 'Statistics of runs:');
        await this.print(`day_${dayIterationStep}_hour_${hourIterationStep}_full`, `Full  run  attempts:  ${fullRun.length}, successful: ${fullRun.filter(ev => ev.ok).length}, failed: ${fullRun.filter(ev => !ev.ok).length}`);
        await this.print(`day_${dayIterationStep}_hour_${hourIterationStep}_shallow`, `Shallow run attempts: ${fullRun.length}, successful: ${shallowRun.filter(ev => ev.ok).length}, failed: ${shallowRun.filter(ev => !ev.ok).length}`);
        await this.print(`day_${dayIterationStep}_hour_${hourIterationStep}_line-break_2`, ' ');
        await this.print(`day_${dayIterationStep}_hour_${hourIterationStep}_added-to-queue`, 'Added to queue:');

        const addedToQueueEvents: AddToQueueEvent[] = hourEvents.filter((ev: StatEvent) => ev.type === STATISTIC_EVENT.ADDING_TO_QUEUE) as AddToQueueEvent[];
        const processingEvents: ProcessingEvent[] = hourEvents.filter((ev: StatEvent) => ev.type === STATISTIC_EVENT.PAGE_PROCESSING) as ProcessingEvent[];
        const collectionAsyncIterator = getArrayIterator(this.collectionList);

        for await (const collection of collectionAsyncIterator) {
          const eventsOfAddingToQueue = addedToQueueEvents.filter((ev: AddToQueueEvent) => (ev as AddToQueueEvent).collection === collection);
          const eventsOfProcessing = processingEvents.filter((ev: ProcessingEvent) => (ev as ProcessingEvent).collection === collection);
          const indexPageEvents = eventsOfAddingToQueue.filter(ev => ev.urlType === UrlTypes.Index);
          const paginationPageEvents = eventsOfAddingToQueue.filter(ev => ev.urlType === UrlTypes.Pagination);
          const adPageEvents = eventsOfAddingToQueue.filter(ev => ev.urlType === UrlTypes.Ad);
          const paginationParsed = eventsOfProcessing.filter(ev => ev.processing === 'pagination_parsed');
          const added = eventsOfProcessing.filter(ev => ev.processing === 'added');
          const activeDateUpdated = eventsOfProcessing.filter(ev => ev.processing === 'active_date');
          const noChanges = eventsOfProcessing.filter(ev => ev.processing === 'no_changes');
          const errorOccurred = eventsOfProcessing.filter(ev => ev.processing === 'error');

          await this.print(`day_${dayIterationStep}_hour_${hourIterationStep}_${collection}_name`, `Collection ${collection}:`);
          await this.print(`day_${dayIterationStep}_hour_${hourIterationStep}_${collection}_index`, `    Index pages (ok/total): ${indexPageEvents.filter(ev => ev.ok).length} / ${indexPageEvents.length}`);
          await this.print(`day_${dayIterationStep}_hour_${hourIterationStep}_${collection}_pagination`, `    Pagination pages (ok/total): ${paginationPageEvents.filter(ev => ev.ok).length} / ${paginationPageEvents.length}`);
          await this.print(`day_${dayIterationStep}_hour_${hourIterationStep}_${collection}_ad`, `    Ad pages (ok/total): ${adPageEvents.filter(ev => ev.ok).length} / ${adPageEvents.length}`);
          await this.print(`day_${dayIterationStep}_hour_${hourIterationStep}_${collection}_parsing`, '    Parsing results:');
          await this.print(`day_${dayIterationStep}_hour_${hourIterationStep}_${collection}_pagination_parsed`, `        Pagination parsed: ${paginationParsed.length}`);
          await this.print(`day_${dayIterationStep}_hour_${hourIterationStep}_${collection}_newly_added`, `        New added: ${added.length}`);
          await this.print(`day_${dayIterationStep}_hour_${hourIterationStep}_${collection}_active_date_updated`, `        Active date updated: ${activeDateUpdated.length}`);
          await this.print(`day_${dayIterationStep}_hour_${hourIterationStep}_${collection}_no_changes`, `        No changes: ${noChanges.length}`);
          await this.print(`day_${dayIterationStep}_hour_${hourIterationStep}_${collection}_error_happened`, `        Errors: ${errorOccurred.length}`);
        }

        hourIterationStep++;
      }

      dayIterationStep++;
    }
  }

  public async sendTaskForWebScraper(data: IUrlData[]): Promise<ITcpResponse<boolean[]>> {
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
      const indexPageProcessingResult: ITcpResponse<boolean[]> = await this
        .sendTaskForWebScraper(tasks);

      this.addToDynamicLogAddingToQueueResult(urlData, tasks, indexPageProcessingResult);
    } catch (e) {
      this.addToDynamicLogProcessingError(urlData, e.message);

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
        this.statisticCollector.add({
          ok: true,
          type: STATISTIC_EVENT.PAGE_PROCESSING,
          collection: urlData.collection,
          urlType: urlData.urlType,
          processing: 'pagination_parsed',
        } as Omit<ProcessingEvent, 'dateMsec'>);

        return;
      }

      const paginationPageProcessingResult: ITcpResponse<boolean[]> = await this
        .sendTaskForWebScraper(adsPagesTasks);

      this.addToDynamicLogAddingToQueueResult(urlData, adsPagesTasks, paginationPageProcessingResult);
    } catch (e) {
      this.addToDynamicLogProcessingError(urlData, e.message);

      await this.logger.error(' ');
      await this.logger.error('Error occurred in AppService.processPaginationPage');
      await this.logger.error('urlData:');
      await this.logger.error(urlData);
      await this.logger.error(e);
    }
  }

  private addToDynamicLogAdSavingResult(urlData: IUrlData, saveAdResult: IAdDBOperationResult) {
    this.statisticCollector.add({
      ok: saveAdResult.status !== AdProcessingStatus.ERROR,
      type: STATISTIC_EVENT.PAGE_PROCESSING,
      collection: urlData.collection,
      urlType: urlData.urlType,
      processing: saveAdResult.status,
      ...(saveAdResult.status === AdProcessingStatus.ERROR && { errorMsg: saveAdResult.errorMsg }),
    } as Omit<ProcessingEvent, 'dateMsec'>);
  }

  public async processAdPage(dataToParse: string, urlData: IUrlData): Promise<void> {
    try {
      const parsedAdPage: Partial<IRealEstate> = new BazarakiAdPageParser(dataToParse, urlData.url).getPageData();
      const typeCastedPageData: Partial<IRealEstate> = this.dbAccessService.typecastingFields(parsedAdPage);

      const saveAdResult: IAdDBOperationResult = await this.dbAccessService.saveNewAnnouncement(urlData.collection, typeCastedPageData);

      this.addToDynamicLogAdSavingResult(urlData, saveAdResult);
    } catch (e) {
      this.addToDynamicLogProcessingError(urlData, e.message);

      await this.logger.error(' ');
      await this.logger.error('Error occurred in AppService.processAdPage');
      await this.logger.error('urlData:');
      await this.logger.error(urlData);
      await this.logger.error(e);
    }
  }

  private addToDynamicLogProcessingError(urlData: IUrlData, errorMsg: unknown): void {
    this.statisticCollector.add({
      ok: false,
      type: STATISTIC_EVENT.PAGE_PROCESSING,
      collection: urlData.collection,
      urlType: urlData.urlType,
      processing: 'error',
      errorMsg: typeof errorMsg !== 'object' ? String(errorMsg) : JSON.stringify(errorMsg),
    } as Omit<ProcessingEvent, 'dateMsec'>);
  }

  private addToDynamicLogAddingToQueueResult(
    urlData: IUrlData,
    tasks: IUrlData[],
    resultResponse: ITcpResponse<boolean[]>,
  ): void {
    this.statisticCollector.add({
      ok: true,
      type: STATISTIC_EVENT.PAGE_PROCESSING,
      collection: urlData.collection,
      urlType: urlData.urlType,
      processing: 'pagination_parsed',
    } as Omit<ProcessingEvent, 'dateMsec'>);

    for (let i = 0; i < tasks.length; i++) {
      this.statisticCollector.add({
        type: STATISTIC_EVENT.ADDING_TO_QUEUE,
        ok: resultResponse.data[i],
        collection: tasks[i].collection,
        urlType: tasks[i].urlType,
        found: true,
      } as Omit<AddToQueueEvent, 'dateMsec'>);
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
