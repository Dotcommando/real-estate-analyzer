import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Inject, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

import { Cache } from 'cache-manager';

import { LOGGER, Messages } from './constants';
import { AppService, DbAccessService, DelayService, ParseService } from './services';
import { IRealEstate } from './types';


@Controller()
export class AppController {
  private readonly cacheTTL = parseInt(this.configService.get('RCACHE_TTL'));

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
    @Payload() url: string,
  ): Promise<Partial<IRealEstate> | null> {
    try {
      const cacheKey = this.appService.getKeyByUrl(url);
      const fromCache = await this.cacheManager.get(cacheKey);
      let pageData: Partial<IRealEstate>;
      let category: string;

      if (!fromCache) {
        await this.delayService.delayRequest();

        const pageResult = await this.appService.getPage(url);

        if (!pageResult) {
          return null;
        }

        [ pageData, category ] = await this.parseService.parsePage(pageResult, url);

        await this.cacheManager.set(cacheKey, [ pageData, category ], this.cacheTTL);
        this.logger.log(`Parsing ${url}. Not found in the cache.`);
      } else {
        [ pageData, category ] = fromCache as [ Partial<IRealEstate>, string ];
        this.logger.log(`Parsing ${url}. Found in the cache.`);
      }

      const savedDocument = this.dbAccessService.saveNewAnnouncement(category, pageData);

      return pageData;
    } catch (e) {
      this.logger.log(`Failed parsing ${url}.`);

      return null;
    }
  }
}
