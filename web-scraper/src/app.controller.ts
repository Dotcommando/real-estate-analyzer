import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { WebScraperMessages } from './constants';
import { AppService } from './services';
import { ITcpResponse, IUrlData } from './types';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {
  }

  @EventPattern(WebScraperMessages.ADD_TO_PARSING_QUEUE)
  public async getPageData(
    @Payload() urlData: IUrlData[],
  ): Promise<ITcpResponse<{ [url: string]: boolean }[]>> {
    return this.appService.addPagesToQueue(urlData);
  }
}
