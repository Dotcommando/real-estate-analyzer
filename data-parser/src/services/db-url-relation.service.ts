import { Inject, Injectable, LoggerService, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LOGGER } from '../constants';


@Injectable()
export class DbUrlRelationService implements OnModuleInit {
  constructor(
    @Inject(LOGGER) private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {
  }

  private sourceUrl: string;
  private collectionList: string[] = [];
  private pathList: string[] = [];
  private urlList: string[] = [];
  private collectionToPathMap = new Map<string, string>();
  private collectionToUrlMap = new Map<string, string>();
  private pathToCollectionMap = new Map<string, string>();
  private urlToCollectionMap = new Map<string, string>();

  onModuleInit(): void {
    this.setSourceUrl();
    this.setCollectionList();
    this.setPathList();
    this.mapPathsAndCollections();
  }

  private setSourceUrl(): void {
    try {
      this.sourceUrl = this.configService.get('SOURCE_URL');
    } catch (e) {
      this.logger.error(' ');
      this.logger.error('Cannot assign source URL in DbUrlRelationService.setSourceUrl');
    }
  }

  private setCollectionList(): void {
    try {
      this.collectionList = JSON.parse(this.configService.get('MONGO_COLLECTIONS'));
    } catch (e) {
      this.logger.error(' ');
      this.logger.error('Cannot assign list of collections in DbUrlRelationService.setCollectionList');
    }
  }

  private setPathList(): void {
    try {
      this.pathList = JSON.parse(this.configService.get('PATHS'));
    } catch (e) {
      this.logger.error(' ');
      this.logger.error('Cannot assign list of collections in DbUrlRelationService.setPathList');
    }
  }

  private mapPathsAndCollections(): void {
    try {
      if (!this.pathList.length) {
        this.logger.error(' ');
        this.logger.error('Error in DbUrlRelationService.mapPathsAndCollections');
        this.logger.error("'pathList' is empty");

        return;
      }

      if (!this.collectionList.length) {
        this.logger.error(' ');
        this.logger.error('Error in DbUrlRelationService.mapPathsAndCollections');
        this.logger.error("'collectionList' is empty");

        return;
      }

      if (this.pathList.length !== this.collectionList.length) {
        this.logger.error(' ');
        this.logger.error('Error in DbUrlRelationService.mapPathsAndCollections');
        this.logger.error("'collectionList' length is not equal to 'pathList'");

        return;
      }

      const length = this.pathList.length;

      for (let i = 0; i < length; i++) {
        this.urlList.push(this.sourceUrl + this.pathList[i]);
        this.collectionToPathMap.set(this.collectionList[i], this.pathList[i]);
        this.pathToCollectionMap.set(this.pathList[i], this.collectionList[i]);
        this.collectionToUrlMap.set(this.collectionList[i], this.urlList[i]);
        this.urlToCollectionMap.set(this.urlList[i], this.collectionList[i]);
      }
    } catch (e) {
      this.logger.error(' ');
      this.logger.error('Error in DbUrlRelationService.mapPathsAndCollections');
      this.logger.error(e);
    }
  }

  public getPathByCollection(collectionName: string): string {
    return this.collectionToPathMap.get(collectionName);
  }

  public getUrlByCollection(collectionName: string): string {
    return this.collectionToUrlMap.get(collectionName);
  }

  public getCollectionByPath(pathName: string): string {
    return this.pathToCollectionMap.get(pathName);
  }

  public getCollectionByUrl(urlName: string): string {
    return this.urlToCollectionMap.get(urlName);
  }

  public getCollectionList(): string[] {
    return [ ...this.collectionList ];
  }

  public getPathList(): string[] {
    return [ ...this.pathList ];
  }

  public getUrlList(): string[] {
    return [ ...this.urlList ];
  }
}
