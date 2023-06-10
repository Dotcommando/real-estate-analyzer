import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

import { Cache } from 'cache-manager';

import { Messages } from './constants';
import { AppService, DbAccessService, DelayService, ParseService } from './services';
import { IRealEstate } from './types';


@Controller()
export class AppController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

    console.log(`data: ${data.length < 30 ? data : data.substring(0, 22) + ' ... ' + data.substring(data.length - 3)}, typeof data: ${typeof data}`);

    // channel.ack(originalMsg);
  }

  @EventPattern(Messages.PARSE_URL)
  public async getPageData(
    @Payload() url: string,
  ): Promise<Partial<IRealEstate> | null> {
    try {
      const fromCache = await this.cacheManager.get(url);
      let pageData: Partial<IRealEstate>;
      let category: string;

      if (!fromCache) {
        await this.delayService.delayRequest();

        const pageResult = await this.appService.getPage(url);

        if (!pageResult) {
          return null;
        }

        [ pageData, category ] = await this.parseService.parsePage(pageResult, url);

        await this.cacheManager.set(url, [ pageData, category ], parseInt(this.configService.get('RCACHE_TTL')));
      } else {
        [ pageData, category ] = fromCache as [ Partial<IRealEstate>, string ];
      }

      const savedDocument = this.dbAccessService.saveNewAnnouncement(category, pageData);

      return pageData;
    } catch (e) {
      return null;
    }
  }
}
