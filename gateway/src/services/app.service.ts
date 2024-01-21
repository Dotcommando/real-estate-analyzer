import { HttpStatus, Inject, Injectable, LoggerService } from '@nestjs/common';

import { cache, CacheType } from 'cache-decorator';

import { DbAccessService } from './db-access.service';

import { LOGGER } from '../constants';
import { roundNumbersInReport } from '../mappers';
import {
  IAdsParams,
  IAdsResult,
  IAnalysisParams,
  IAnalysisResult,
  ICityStats,
  IDistrictStats,
  IGetDistrictsParams,
  IGetDistrictsResult,
  IResponse,
} from '../types';


@Injectable()
export class AppService {
  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService,
    private readonly dbAccessService: DbAccessService,
  ) {
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
      } ;
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
}
