import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

import { Messages } from './constants';
import { AppService } from './services';
import { dateInHumanReadableFormat } from './utils';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {
  }

  @EventPattern(Messages.TEST)
  public async healthCheck(
    @Payload() data: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context?.getChannelRef();
    const originalMsg = context?.getMessage();

    console.log(`${dateInHumanReadableFormat(new Date())}, data: ${data}, typeof data: ${typeof data}`);

    if (typeof data === 'string') {
      const pageResult = await this.appService.getPage(data);

      console.log(pageResult);
    }

    channel.ack(originalMsg);
  }

  @EventPattern(Messages.PARSE_URL)
  public async getPageData(
    @Payload() data: string,
  ) {
    try {
      const pageResult: string = await this.appService.getPage(data);

      console.log(pageResult);

      return pageResult;
    } catch (e) {
      return null;
    }
  }
}
