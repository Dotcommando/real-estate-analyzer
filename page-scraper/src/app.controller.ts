import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Inject, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventPattern, Payload } from '@nestjs/microservices';

import { Cache } from 'cache-manager';

import { LOGGER, Messages } from './constants';
import { AppService, DbAccessService, DelayService, ParseService } from './services';
import { IRealEstate, IUrlToVisitData } from './types';


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
    return await this.appService.getPageData(urlData);
  }
}
