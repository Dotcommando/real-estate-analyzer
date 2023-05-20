import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

import { AppService } from './app.service';
import { Messages } from './constants';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @EventPattern('test')
  public async healthCheck(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
    console.log('Message received!');

    const channel = context?.getChannelRef();
    const originalMsg = context?.getMessage();

    console.log(`Pattern: ${context.getPattern()}`);
    console.log(`Data: ${data}`);

    channel.ack(originalMsg);
  }
}
