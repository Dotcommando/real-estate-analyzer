import { Controller, Get } from '@nestjs/common';

import { AppService } from './services';
import { IResponse } from './types';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('healthz')
  checkHealth(): IResponse<{ alive: boolean }> {
    return this.appService.checkHealth();
  }
}
