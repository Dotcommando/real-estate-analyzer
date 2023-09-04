import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { Messages } from './constants';
import { AppService } from './services';
import { IUrlData } from './types';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {
  }

  @EventPattern(Messages.ADD_TO_PARSING_QUEUE)
  public async getPageData(
    @Payload() urlData: IUrlData[],
  ): Promise< { [url: string]: boolean }[]> {
    return this.appService.addPagesToQueue(urlData);
  }
}