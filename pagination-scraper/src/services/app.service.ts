import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';

import { AxiosResponse } from 'axios';


@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,
  ) {
  }

  public async getPage(pageUrl: string): Promise<string | null> {
    try {
      const pageDataResponse: AxiosResponse = await this.httpService.axiosRef
        .get(pageUrl);

      if (pageDataResponse.status === HttpStatus.OK) {
        return pageDataResponse.data;
      }

      return null;
    } catch (e) {
      return null;
    }
  }
}
