import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { ITcpResponse, IUrlData } from '../types';


@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,
  ) {
  }

  public async addPageToQueue(urlData: IUrlData[]): Promise<ITcpResponse> {
    console.log(urlData);

    return {
      success: true,
      data: '',
      urlData,
    };
  }
}
