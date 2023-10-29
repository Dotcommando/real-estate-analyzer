import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { WebScraperMessages } from './constants';
import { AppService } from './services';
import { IAddToQueueResult, ITask, ITcpResponse } from './types';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {
  }

  @EventPattern(WebScraperMessages.ADD_TO_PARSING_QUEUE)
  public async getPageData(
    @Payload() tasks: ITask[],
  ): Promise<ITcpResponse<{ [url: string]: IAddToQueueResult }>> {
    return this.appService.addPagesToQueue(tasks);
  }
}
