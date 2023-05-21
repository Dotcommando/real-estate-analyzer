import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

import { Messages } from './constants';
import { AppService, ParseService } from './services';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly parseService: ParseService,
  ) {
  }

  @EventPattern(Messages.TEST)
  public async healthCheck(
    @Payload() data: string,
    // @Ctx() context: RmqContext,
  ) {
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
      const pageResult: string = await this.appService.getPage(url);

      if (typeof url === 'string') {
        const pageResult = await this.appService.getPage(url);
        const pageData = this.parseService.parsePage(pageResult, url);

        // console.log(pageResult);
      }

      return pageResult;
    } catch (e) {
      return null;
    }
  }
}
