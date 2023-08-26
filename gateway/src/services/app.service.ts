import { HttpStatus, Injectable } from '@nestjs/common';

import { IResponse } from '../types';


@Injectable()
export class AppService {
  getHello(): IResponse<string> {
    return {
      status: HttpStatus.OK,
      data: 'Hello World!',
    };
  }
}
