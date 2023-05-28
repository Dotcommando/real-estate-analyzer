import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

import { Cache } from 'cache-manager';

import { Messages } from './constants';
import { AppService, DelayService, ParseService } from './services';


@Controller()
export class AppController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly appService: AppService,
    private readonly parseService: ParseService,
    private readonly configService: ConfigService,
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
  ) {
    try {
      let pageData = await this.cacheManager.get(url);

      if (!pageData) {
        console.log(' ');
        console.log('No data found in the cache. Doing a request');

        await this.delayService.delayRequest();

        const pageResult = await this.appService.getPage(url);

        pageData = await this.parseService.parsePage(pageResult, url);

        await this.cacheManager.set(url, pageData, parseInt(this.configService.get('RCACHE_TTL')));
      } else {
        console.log(' ');
        console.log('Data found in the cache');
      }

      console.log(pageData);

      return pageData;
    } catch (e) {
      return null;
    }
  }
}
