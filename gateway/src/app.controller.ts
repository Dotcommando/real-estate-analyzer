import { Controller, Get, Query } from '@nestjs/common';

import { AdsDto, DistrictsDto, SearchQueryDto, StatsDto } from './dto';
import { queryAdsToAds, queryGetDistricts, queryStatsToStats } from './mappers';
import { AppService } from './services';
import { IAnalysisResult, ICityStats, IDistrictStats, IGetDistrictsResult, IResponse } from './types';
import { IAdsResult } from './types';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {
  }

  @Get('/healthz')
  checkHealth(): IResponse<{ alive: boolean }> {
    return this.appService.checkHealth();
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
  ): Promise<IResponse<{ ads: IAdsResult; total: number }>> {
    return this.appService.getAds(queryAdsToAds(query));
  }

  @Get('/districts')
  public async getDistricts(
    @Query() query: DistrictsDto,
  ): Promise<IResponse<IGetDistrictsResult[]>> {
    return this.appService.getDistricts(queryGetDistricts(query));
  }

  @Get('/search')
  public async getSearchResults(
    @Query() query: SearchQueryDto,
  ) {
    // return this.appService.getSearchResults();
    return [];
  }
}
