import { HttpStatus, Injectable } from '@nestjs/common';

import { IResponse } from '../types';


@Injectable()
export class AppService {
  public checkHealth(): IResponse<{ alive: boolean }> {
    return {
      status: HttpStatus.OK,
      data: {
        alive: true,
      },
    };
  }
}
