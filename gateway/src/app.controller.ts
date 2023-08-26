import { Controller, Get, Query } from '@nestjs/common';

import { StatsDto } from './dto';
import { queryStatsToStats } from './mappers';
import { AppService } from './services';
import { IAnalysisResult, ICityStats, IDistrictStats, IResponse } from './types';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {
  }

  @Get('/check-alive')
  getHello(): IResponse<string> {
    return this.appService.getHello();
  }

  @Get('/stats')
  public async getStats(
    @Query() query: StatsDto,
  ): Promise<IResponse<IAnalysisResult<ICityStats>[] | IAnalysisResult<IDistrictStats>[]>> {
    return this.appService.getAnalysis(queryStatsToStats(query));
  }
}
