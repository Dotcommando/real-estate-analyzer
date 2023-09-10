import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { DataParserMessages, UrlTypes } from './constants';
import { AppService } from './services';
import { ITcpResponse, IWebScrapingResponse } from './types';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {
  }

  @EventPattern(DataParserMessages.PARSE_PAGE)
  public async parsePage(
    @Payload() scrapingResult: IWebScrapingResponse,
  ): Promise<ITcpResponse> {
    if (!scrapingResult.success) {
      return {
        success: true,
        data: 'received',
      };
    }

    if (scrapingResult.urlData.urlType === UrlTypes.Index) {
      this.appService.processIndexPage(scrapingResult.data, scrapingResult.urlData);
    } else if (scrapingResult.urlData.urlType === UrlTypes.Pagination) {
      this.appService.processPaginationPage(scrapingResult.data, scrapingResult.urlData);
    } else if (scrapingResult.urlData.urlType === UrlTypes.Ad) {
      this.appService.processAdPage(scrapingResult.data, scrapingResult.urlData);
    }

    return {
      success: true,
      data: 'received',
    };
  }
}
