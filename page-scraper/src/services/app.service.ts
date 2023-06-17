import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AxiosResponse } from 'axios';


@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
  }

  private readonly baseUrl = this.configService.get('BASE_URL');
  private readonly prefix = this.configService.get('RCACHE_PREFIX');

  public getKeyByUrl(url: string): string {
    return this.prefix + url.replace(this.baseUrl, '');
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
