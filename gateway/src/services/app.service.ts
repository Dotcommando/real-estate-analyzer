import { HttpStatus, Injectable } from '@nestjs/common';

import { IAnalysis, IAnalysisParams, IAvgMean, IResponse } from '../types';


@Injectable()
export class AppService {
  getHello(): IResponse<string> {
    return {
      status: HttpStatus.OK,
      data: 'Hello World!',
    };
  }

  public async getAnalysis(params: IAnalysisParams): Promise<IResponse<IAnalysis<string, IAvgMean>>> {
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
    } as unknown as IResponse<IAnalysis<string, IAvgMean>>;
  }
}
