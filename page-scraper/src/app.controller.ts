import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

import { Messages } from './constants';


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

    console.log('Message received!');
    console.log(`Pattern: ${context.getPattern()}`);
    console.log(`Data: ${data}`);

    channel.ack(originalMsg);
  }
}
