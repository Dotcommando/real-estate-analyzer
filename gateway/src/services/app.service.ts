import { HttpStatus, Injectable } from '@nestjs/common';

import { IAnalysis, IAnalysisParams, IDistrictStats, IResponse } from '../types';


@Injectable()
export class AppService {
  getHello(): IResponse<string> {
    return {
      status: HttpStatus.OK,
      data: 'Hello World!',
    };
  }

  public async getAnalysis(params: IAnalysisParams): Promise<IResponse<IAnalysis<string, IDistrictStats>>> {
    if (params.startDate.getTime() > params.endDate.getTime()) {
      return {
        status: HttpStatus.BAD_REQUEST,
        data: null,
        errors: [ 'The End date is less than the Start date' ],
      };
    }

    return {
      status: HttpStatus.OK,
      data: [],
    } as unknown as IResponse<IAnalysis<string, IDistrictStats>>;
  }
}
