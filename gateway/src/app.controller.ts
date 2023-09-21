import { Controller, Get, Query } from '@nestjs/common';

import { AdsDto, StatsDto } from './dto';
import { queryAdsToAds, queryStatsToStats } from './mappers';
import { AppService } from './services';
import { IAnalysisResult, ICityStats, IDistrictStats, IResponse } from './types';
import { IAdsResult } from './types/ads';


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

  @Get('/ads')
  public async getAds(
    @Query() query: AdsDto,
  ): Promise<IResponse<IAdsResult>> {
    return this.appService.getAds(queryAdsToAds(query));
  }
}
