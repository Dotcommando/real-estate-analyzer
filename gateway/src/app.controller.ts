import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';

import { configDotenv } from 'dotenv';

import { AdsDto, CreateInvitationDto, DeleteInvitationDto, DistrictsDto, SearchQueryDto, StatsDto } from './dto';
import { EnvironmentGuard, InvitationGuard } from './guards';
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


configDotenv();

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

  @UseGuards(InvitationGuard)
  @Get('/search')
  public async getSearchResults(
    @Query() query: SearchQueryDto,
  ): Promise<IResponse<{
    result: IRentResidentialId[] | ISaleResidentialId[];
    total: number;
  }>> {
    return this.appService.getSearchResults(query);
  }

  @UseGuards(new EnvironmentGuard(process.env.MODE as 'dev' | 'prod', 'dev'))
  @Post('/invitation')
  async createInvitation(
    @Body() createInvitationDto: CreateInvitationDto,
  ): Promise<IResponse<{ created: boolean; token: string }>> {
    return this.appService.createInvitation(createInvitationDto.rawToken, createInvitationDto.description);
  }

  @UseGuards(new EnvironmentGuard(process.env.MODE as 'dev' | 'prod', 'dev'))
  @Delete('/invitation')
  async deleteInvitation(
    @Body() deleteInvitationDto: DeleteInvitationDto,
  ): Promise<IResponse<{ deleted: boolean; token: string }>> {
    return this.appService.deleteInvitation(deleteInvitationDto.rawToken);
  }
}
