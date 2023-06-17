import { Controller } from '@nestjs/common';

import { AppService } from './services';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {
  }
}
