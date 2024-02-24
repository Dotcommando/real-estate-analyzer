import { Controller, Get, Query } from '@nestjs/common';

import { AdsDto, DistrictsDto, SearchQueryDto, StatsDto } from './dto';
import { queryAdsToAds, queryGetDistricts, queryStatsToStats } from './mappers';
import { AppService } from './services';
import {
  IAnalysisResult,
  ICityStats,
  IDistrictStats,
  IGetDistrictsResult,
  IRentLimits,
  IRentResidentialId,
  IResponse,
  ISaleLimits,
  ISaleResidentialId,
} from './types';
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

  @Get('/rent-limits')
  public async getRentLimits(): Promise<IResponse<IRentLimits>> {
    return this.appService.getRentLimits();
  }

  @Get('/sale-limits')
  public async getSaleLimits(): Promise<IResponse<ISaleLimits>> {
    return this.appService.getSaleLimits();
  }

  @Get('/search')
  public async getSearchResults(
    @Query() query: SearchQueryDto,
  ): Promise<IResponse<{
    result: IRentResidentialId[] | ISaleResidentialId[];
    total: number;
  }>> {
    return this.appService.getSearchResults(query);
  }
}
