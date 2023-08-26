import { Controller, Get, Query } from '@nestjs/common';

import { StatsDto } from './dto';
import { queryStatsToStats } from './mappers';
import { AppService } from './services';
import { IAnalysis, IAvgMean, IResponse } from './types';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {
  }

  @Get()
  getHello(): IResponse<string> {
    return this.appService.getHello();
  }

  @Get('/stats')
  public async getStats(
    @Query() query: StatsDto,
  ): Promise<IResponse<IAnalysis<string, IAvgMean>>> {
    return this.appService.getAnalysis(queryStatsToStats(query));
  }
}
