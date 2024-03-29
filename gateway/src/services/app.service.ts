import { HttpStatus, Inject, Injectable, LoggerService } from '@nestjs/common';

import { cache, CacheType } from 'cache-decorator';

import { DbAccessService } from './db-access.service';

import { LOGGER, PAGINATION_MAX_LIMIT } from '../constants';
import { SearchQueryDto } from '../dto';
import {
  mapToGetRentResidentialQueryMapper,
  mapToGetRentResidentialSortMapper,
  roundNumbersInReport,
} from '../mappers';
import {
  IAdsParams,
  IAdsResult,
  IAnalysisParams,
  IAnalysisResult,
  ICityStats,
  IDistrictStats,
  IGetDistrictsParams,
  IGetDistrictsResult,
  IGetRentResidentialQuery,
  IGetRentResidentialSort,
  IRentLimits,
  IRentResidentialId,
  IResponse,
  ISaleLimits,
  ISaleResidentialId,
} from '../types';


@Injectable()
export class AppService {
  private cacheStore = new Map<string, { data: any; timeout: NodeJS.Timeout }>();

  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService,
    private readonly dbAccessService: DbAccessService,
  ) {
  }

  private getInvitationCacheKey(rawToken: string): string {
    return `invitation:${rawToken}`;
  }

  public checkHealth(): IResponse<{ alive: boolean }> {
    return {
      status: HttpStatus.OK,
      data: {
        alive: true,
      },
    };
  }

  public async getAnalysis(params: IAnalysisParams): Promise<IResponse<IAnalysisResult<ICityStats>[] | IAnalysisResult<IDistrictStats>[]>> {
    try {
      if (params.startDate.getTime() > params.endDate.getTime()) {
        return {
          status: HttpStatus.BAD_REQUEST,
          data: null,
          errors: [ 'The End date is less than the Start date' ],
        };
      }

      const docs: IAnalysisResult<ICityStats>[] | IAnalysisResult<IDistrictStats>[] = await this.dbAccessService.getAnalysis(params);
      const docsWithRoundedNumbers = roundNumbersInReport<IAnalysisResult<ICityStats> | IAnalysisResult<IDistrictStats>>(docs) as IAnalysisResult<ICityStats>[] | IAnalysisResult<IDistrictStats>[];

      return {
        status: HttpStatus.OK,
        data: docsWithRoundedNumbers,
      };
    } catch (e) {
      this.logger.error('Error occurred in AppService.getAnalysis with parameters:');

      if (params) {
        for (const key in params) {
          this.logger.error(`    ${key}: ${params[key]},`);
        }
      } else {
        this.logger.error(`    params === ${params}, typeof params === ${typeof params}.`);
      }

      this.logger.error(e);

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errors: [
          'Cannot get statistics',
        ],
      };
    }
  }

  public async getAds(params: IAdsParams): Promise<IResponse<{ ads: IAdsResult; total: number }>> {
    try {
      if (params.startDate.getTime() > params.endDate.getTime()) {
        return {
          status: HttpStatus.BAD_REQUEST,
          data: null,
          errors: [ 'The End date is less than the Start date' ],
        };
      }

      const ads: {ads: IAdsResult; total: number } = await this.dbAccessService.getAds(params);

      return {
        status: HttpStatus.OK,
        data: ads,
      };
    } catch (e) {
      this.logger.error('Error occurred in AppService.getAds with parameters:');

      if (params) {
        for (const key in params) {
          this.logger.error(`    ${key}: ${params[key]},`);
        }
      } else {
        this.logger.error(`    params === ${params}, typeof params === ${typeof params}.`);
      }

      this.logger.error(e);

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errors: [
          'Cannot get ads',
        ],
      };
    }
  }

  @cache({
    ttl: 24 * 60 * 60 * 1000,
    type: CacheType.MEMO,
    compare: (oldVal: [IGetDistrictsParams], newVal: [IGetDistrictsParams]) => oldVal[0].country === newVal[0].country && oldVal[0].city === newVal[0].city,
  })
  public async getDistricts(params: IGetDistrictsParams): Promise<IResponse<IGetDistrictsResult[]>> {
    try {
      const district: IGetDistrictsResult[] = await this.dbAccessService.getDistrict(params);

      return {
        status: HttpStatus.OK,
        data: district,
      };
    } catch (e) {
      this.logger.error('Error occurred in AppService.getDistricts with parameters:');

      if (params) {
        for (const key in params) {
          this.logger.error(`    ${key}: ${params[key]},`);
        }
      } else {
        this.logger.error(`    params === ${params}, typeof params === ${typeof params}.`);
      }

      this.logger.error(e);

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errors: [
          'Cannot get districts',
        ],
      };
    }
  }

  @cache({
    ttl: 4 * 60 * 1000,
    type: CacheType.MEMO,
  })
  public async getRentLimits(): Promise<IResponse<IRentLimits>> {
    try {
      const limits: IRentLimits = await this.dbAccessService.getRentLimits();

      return {
        status: HttpStatus.OK,
        data: limits,
      };
    } catch (e) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errors: [ 'Cannot get rent limits' ],
      };
    }
  }

  @cache({
    ttl: 4 * 60 * 1000,
    type: CacheType.MEMO,
  })
  public async getSaleLimits(): Promise<IResponse<ISaleLimits>> {
    try {
      const limits: ISaleLimits = await this.dbAccessService.getSaleLimits();

      return {
        status: HttpStatus.OK,
        data: limits,
      };
    } catch (e) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errors: [ 'Cannot get sale limits' ],
      };
    }
  }

  public async getSearchResults(query: SearchQueryDto): Promise<IResponse<{
    result: IRentResidentialId[] | ISaleResidentialId[];
    total: number;
  }>> {
    const mappedQuery: IGetRentResidentialQuery = mapToGetRentResidentialQueryMapper(query);
    const mapperSort: IGetRentResidentialSort = mapToGetRentResidentialSortMapper(query, { price: 1 });
    const offset = Math.max(query.offset, 0);
    const limit = Math.min(query.limit, PAGINATION_MAX_LIMIT);
    const result = query.type === 'rent'
      ? await this.dbAccessService.getRentResidential(mappedQuery, mapperSort, offset, limit)
      : await this.dbAccessService.getSaleResidential(mappedQuery, mapperSort, offset, limit);

    return {
      status: HttpStatus.OK,
      data: {
        result: result.data ?? [],
        total: result.total ?? 0,
      },
    };
  }

  public async createInvitation(rawToken: string, description: string): Promise<IResponse<{ created: boolean; token: string }>> {
    try {
      const alreadyExist: boolean = await this.dbAccessService.validateInvitation(rawToken);

      if (alreadyExist) {
        return {
          status: HttpStatus.CONFLICT,
          data: {
            created: false,
            token: rawToken,
          },
          errors: [ `Token '${rawToken}' already exists` ],
        };
      }

      const tokenCreationResponse: { created: boolean; token: string } = await this.dbAccessService.createInvitation(rawToken, description);

      return {
        status: HttpStatus.CREATED,
        data: {
          created: tokenCreationResponse.created,
          token: tokenCreationResponse.token,
        },
      };
    } catch (e) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {
          created: false,
          token: rawToken,
        },
        errors: [ e.message ],
      };
    }
  }

  public async deleteInvitation(rawToken: string): Promise<IResponse<{ deleted: boolean; token: string }>> {
    try {
      const removalResponse = await this.dbAccessService.deleteInvitation(rawToken);

      return {
        status: HttpStatus.ACCEPTED,
        data: removalResponse,
      };
    } catch (e) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {
          deleted: false,
          token: rawToken,
        },
        errors: [ e.message ],
      };
    }
  }

  public async validateInvitation(rawToken: string): Promise<IResponse<{ valid: boolean }>> {
    try {
      const cacheKey = this.getInvitationCacheKey(rawToken);
      const cached = this.cacheStore.get(cacheKey);

      if (cached) {
        return cached.data;
      }

      const valid = await this.dbAccessService.validateInvitation(rawToken);
      const response = {
        status: HttpStatus.OK,
        data: {
          valid,
        },
      };

      if (valid) {
        const timeout = setTimeout(() => {
          this.cacheStore.delete(cacheKey);
        }, 24 * 60 * 60 * 1000);

        this.cacheStore.set(cacheKey, { data: response, timeout });
      }

      return response;
    } catch (e) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {
          valid: false,
        },
        errors: [ e.message ],
      };
    }
  }
}
