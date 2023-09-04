import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { DataParserMessages } from './constants';
import { AppService } from './services';
import { ITcpMessageResult } from './types';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {
  }

  @EventPattern(DataParserMessages.PARSE_INDEX_PAGE)
  public async parseIndexPage(
    @Payload() scrapingResult: ITcpMessageResult,
  ): Promise<any> {
    return true;
  }

  @EventPattern(DataParserMessages.PARSE_PAGINATION_PAGE)
  public async parsePaginationPage(
    @Payload() scrapingResult: ITcpMessageResult,
  ): Promise<any> {
    return true;
  }

  @EventPattern(DataParserMessages.PARSE_AD_PAGE)
  public async parseAdPage(
    @Payload() scrapingResult: ITcpMessageResult,
  ): Promise<any> {
    return true;
  }
}
