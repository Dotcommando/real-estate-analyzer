import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

import { Messages } from './constants';
import { dateInHumanReadableFormat } from './utils';


@Controller()
export class AppController {
  constructor() {
  }

  @EventPattern(Messages.TEST)
  public async healthCheck(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
    const channel = context?.getChannelRef();
    const originalMsg = context?.getMessage();

    console.log(`${dateInHumanReadableFormat(new Date())}, data: ${data}, typeof data: ${typeof data}`);

    channel.ack(originalMsg);
  }
}
