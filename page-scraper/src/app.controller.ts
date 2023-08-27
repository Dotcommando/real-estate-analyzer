import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { Messages } from './constants';
import { AppService } from './services';
import { IRealEstate, IUrlToVisitData } from './types';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {
  }

  @EventPattern(Messages.PARSE_URL)
  public async getPageData(
    @Payload() urlData: IUrlToVisitData,
  ): Promise<Partial<IRealEstate> | null> {
    return await this.appService.getPageData(urlData);
  }

  @EventPattern(Messages.PARSE_URLS)
  public async getPagesData(
    @Payload() urlsData: IUrlToVisitData[],
  ): Promise<boolean> {
    return await this.appService.getPagesData(urlsData);
  }
}
