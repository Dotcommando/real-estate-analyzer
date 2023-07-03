import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpStatus, Injectable, LoggerService } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { ConfigService } from '@nestjs/config';

import { AxiosResponse } from 'axios';
import { Cache } from 'cache-manager';

import { DbAccessService } from './db-access.service';
import { DelayService } from './delay.service';
import { ParseService } from './parse.service';

import { LOGGER } from '../constants';
import { IAdDBOperationResult, IRealEstate, IRealEstateDoc, IUrlToVisitData } from '../types';
import { roundDate } from '../utils';


@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(LOGGER) private readonly logger: LoggerService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly dbAccessService: DbAccessService,
    private readonly delayService: DelayService,
    private readonly parseService: ParseService,
  ) {
  }

  private readonly baseUrl = this.configService.get('BASE_URL');
  private readonly prefix = this.configService.get('RCACHE_PREFIX');
  private readonly cacheTTL = parseInt(this.configService.get('RCACHE_TTL'));

  public getKeyByUrl(url: string): string {
    return this.prefix + url.replace(this.baseUrl, '');
  }

  private async getPage(pageUrl: string): Promise<string | null> {
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

  private async parseAndSave(url: string, redirectFrom?: number): Promise<Partial<IRealEstate>> {
    const cacheKey = this.getKeyByUrl(url);
    const delay: number = await this.delayService.delayRequest();
    const pageResult = await this.getPage(url);
    const path = url.replace(this.baseUrl, '');

    if (!pageResult) {
      this.logger.error(`${path}: Parsing failed.`);

      return null;
    }

    const [ pageData, category ] = await this.parseService.parsePage(pageResult, url);
    const typeCastedPageData: Partial<IRealEstate> = this.dbAccessService.typecastingFields(pageData);

    await this.cacheManager.set(cacheKey, [ typeCastedPageData, category ], this.cacheTTL);

    if (typeCastedPageData.expired) {
      this.logger.log(`${path}: ${redirectFrom ? redirectFrom : 1}, is new. EXPIRED. Skipped.`);

      return typeCastedPageData;
    }

    const savingResult: IAdDBOperationResult = await this.dbAccessService.saveNewAnnouncement(category, typeCastedPageData);

    if (savingResult.error) {
      this.logger.error(`${path}: ${redirectFrom ? redirectFrom : 1}, parsing. Delay ${Math.round(delay / 100) / 10} sec. ${savingResult.status}`);
    } else {
      this.logger.log(`${path}: ${redirectFrom ? redirectFrom : 1}, parsing. Delay ${Math.round(delay / 100) / 10} sec. ${savingResult.status}`);
    }

    return savingResult.ad;
  }

  private async moveFromCacheToDB(url: string, fromCache: [ Partial<IRealEstate>, string ]): Promise<Partial<IRealEstate>> {
    const [ pageData, category ] = fromCache;
    const path = url.replace(this.baseUrl, '');

    const savingResult: IAdDBOperationResult = await this.dbAccessService.saveNewAnnouncement(category, pageData);

    if (savingResult.error) {
      this.logger.error(`${path}: 2, found in cache but not in DB. ${savingResult.status}`);
    } else {
      this.logger.log(`${path}: 2, found in cache but not in DB. ${savingResult.status}`);
    }

    return pageData;
  }

  private async updateActiveDate(url: string, fromCache: [ Partial<IRealEstate>, string ]) {
    if (Array.isArray(fromCache) && fromCache.length) {
      const [ pageData, category ] = fromCache as [ Partial<IRealEstate>, string ];
      const path = url.replace(this.baseUrl, '');
      const updatingResult: IAdDBOperationResult = await this.dbAccessService.updateActiveDate(category, url, roundDate(new Date()));

      if (updatingResult.error) {
        this.logger.error(`${ path }: 3, exists in DB. ${ updatingResult.status }`);
      } else {
        this.logger.log(`${ path }: 3, exists in DB. ${ updatingResult.status }`);
      }

      return pageData;
    } else {
      return await this.parseAndSave(url, 4);
    }
  }

  public async getPageData(urlData: IUrlToVisitData): Promise<Partial<IRealEstate> | null> {
    try {
      const cacheKey = this.getKeyByUrl(urlData.url);
      const fromCache = await this.cacheManager.get(cacheKey);
      const fromPromises = await Promise.allSettled([
        this.cacheManager.get(cacheKey),
        this.dbAccessService.findDuplicate(urlData.category, urlData.url),
      ]);

      if (fromPromises[1].status === 'rejected') {
        this.logger.error(`Could not process ${urlData.url} from category ${urlData.category}. DB error.`);

        return null;
      }

      const fromDB = (fromPromises[1] as PromiseFulfilledResult<IAdDBOperationResult<IRealEstateDoc>>)?.value ?? null;

      if (!fromDB && !fromCache) {
        return await this.parseAndSave(urlData.url);
      } else if (!fromDB && fromCache) {
        return await this.moveFromCacheToDB(urlData.url, fromCache as [ Partial<IRealEstate>, string ]);
      } else {
        // (fromDB && !fromCache) || (fromDB && fromCache)
        return await this.updateActiveDate(urlData.url, fromCache as [ Partial<IRealEstate>, string ]);
      }
    } catch (e) {
      this.logger.error(`${urlData.url.replace(this.baseUrl, '')}: parsing failed. Category ${urlData.category}.`);

      return null;
    }
  }
}
