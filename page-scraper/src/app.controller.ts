import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Inject, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventPattern, Payload } from '@nestjs/microservices';

import { Cache } from 'cache-manager';

import { LOGGER, Messages } from './constants';
import { AppService, DbAccessService, DelayService, ParseService } from './services';
import { IRealEstate, IUrlToVisitData } from './types';
import { roundDate } from './utils';


@Controller()
export class AppController {
  private readonly cacheTTL = parseInt(this.configService.get('RCACHE_TTL'));
  private readonly baseUrl = this.configService.get('BASE_URL');

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(LOGGER) private readonly logger: LoggerService,
    private readonly appService: AppService,
    private readonly parseService: ParseService,
    private readonly configService: ConfigService,
    private readonly dbAccessService: DbAccessService,
    private readonly delayService: DelayService,
  ) {
  }

  @EventPattern(Messages.TEST)
  public async healthCheck(
    @Payload() data: string,
    // @Ctx() context: RmqContext,
  ): Promise<void> {
    // const channel = context?.getChannelRef();
    // const originalMsg = context?.getMessage();

    this.logger.log(`data: ${data.length < 30 ? data : data.substring(0, 22) + ' ... ' + data.substring(data.length - 3)}, typeof data: ${typeof data}`);

    // channel.ack(originalMsg);
  }

  @EventPattern(Messages.PARSE_URL)
  public async getPageData(
    @Payload() urlData: IUrlToVisitData,
  ): Promise<Partial<IRealEstate> | null> {
    try {
      const cacheKey = this.appService.getKeyByUrl(urlData.url);
      const fromCache = await this.cacheManager.get(cacheKey);
      const fromPromises = await Promise.allSettled([
        this.cacheManager.get(cacheKey),
        this.dbAccessService.findDuplicateAndUpdateActiveDate(urlData.category, urlData.url, roundDate(new Date())),
      ]);

      if (fromPromises[0].status === 'rejected' && fromPromises[1].status === 'rejected') {
        this.logger.error(`Could not process ${urlData.url} from category ${urlData.category}.`);

        return null;
      }

      const fromDB = (fromPromises[1] as PromiseFulfilledResult<any>)?.value ?? null;

      if (fromDB && !fromCache) {
        await this.cacheManager.set(cacheKey, [ fromDB, urlData.category ], this.cacheTTL);

        this.logger.log(`${urlData.url.replace(this.baseUrl, '')}: not found in cache, but found in DB. Processed.`);

        return fromDB;
      } else if (!fromDB && !fromCache) {
        const delay: number = await this.delayService.delayRequest();
        const pageResult = await this.appService.getPage(urlData.url);

        if (!pageResult) {
          return null;
        }

        const [ pageData, category ] = await this.parseService.parsePage(pageResult, urlData.url);

        await this.cacheManager.set(cacheKey, [ pageData, category ], this.cacheTTL);
        this.logger.log(`${urlData.url.replace(this.baseUrl, '')}: not found in the cache and in the DB. Waiting ${Math.round(delay / 100) / 10} sec. Parsing.`);

        return this.dbAccessService.saveNewAnnouncement(category, pageData);
      } else {
        const [ pageData, category ] = fromCache as [ Partial<IRealEstate>, string ];

        this.logger.log(`${urlData.url.replace(this.baseUrl, '')}: found in the cache. Active dates updated.`);

        return pageData;
      }
    } catch (e) {
      this.logger.error(`${urlData.url.replace(this.baseUrl, '')}: parsing failed. Category ${urlData.category}.`);

      return null;
    }
  }
}
