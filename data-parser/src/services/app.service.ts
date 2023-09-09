import { Inject, Injectable, LoggerService, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';

import { lastValueFrom, timeout } from 'rxjs';

import { CacheService } from './cache.service';
import { ProxyFactoryService } from './proxy-factory.service';

import { LOGGER, UrlTypes, WebScraperMessages } from '../constants';
import { ITcpMessageResult, IUrlData } from '../types';


@Injectable()
export class AppService implements OnModuleInit {
  private webScraperClient: ClientProxy;
  private tcpTimeout = parseInt(this.configService.get<string>('TCP_TIMEOUT'));

  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService,
    private readonly cacheManager: CacheService,
    private readonly configService: ConfigService,
    private readonly proxyFactory: ProxyFactoryService,
  ) {
  }

  async onModuleInit(): Promise<void> {
    try {
      this.webScraperClient = this.proxyFactory.getClientProxy();

      const taskResponse = await this.sendTaskForWebScraper([
        {
          priority: 1,
          url: 'https://www.bazaraki.com/adv/4739162_3-bedroom-apartment-to-rent/',
          urlType: UrlTypes.Ad,
          category: 'rentapartmentsflats',
        },
        {
          priority: 10,
          url: 'https://www.bazaraki.com/real-estate-to-rent/apartments-flats/',
          urlType: UrlTypes.Index,
          category: 'rentapartmentsflats',
        },
      ]);

      console.log(taskResponse);
    } catch (e) {
      this.logger.error('Error in AppService.onModuleInit');
      this.logger.error(e);
    }
  }

  public async sendTaskForWebScraper(data: IUrlData[]): Promise<boolean[]> {
    return await lastValueFrom(
      this.webScraperClient.send(WebScraperMessages.ADD_TO_PARSING_QUEUE, data)
        .pipe(timeout(this.tcpTimeout)),
    );
  }
}
