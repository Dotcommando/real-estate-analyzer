import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  AdPageParserAbstract,
  BazarakiAdPageParser,
  BazarakiPaginationParser,
  OfferComCyAdPageParser,
  OfferComCyPaginationParser,
  PaginationParserAbstract,
} from '../classes';
import { IRealEstate } from '../types';


@Injectable()
export class ParserFactory implements OnModuleInit {
  private adPageParserClass: new (pageContent: string, url: string) => AdPageParserAbstract<IRealEstate>;
  private paginationParserClass: new (pageContent: string, url: string) => PaginationParserAbstract;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const sourceUrl = this.configService.get<string>('SOURCE_URL');

    if (sourceUrl.includes('bazaraki.com')) {
      this.adPageParserClass = BazarakiAdPageParser;
      this.paginationParserClass = BazarakiPaginationParser;
    } else if (sourceUrl.includes('offer.com.cy')) {
      this.adPageParserClass = OfferComCyAdPageParser;
      this.paginationParserClass = OfferComCyPaginationParser;
    } else {
      throw new Error('Unsupported URL in SOURCE_URL');
    }
  }

  public createAdPageParser(pageContent: string, url: string): AdPageParserAbstract<IRealEstate> {
    return new this.adPageParserClass(pageContent, url);
  }

  public createPaginationParser(pageContent: string, url: string): PaginationParserAbstract {
    return new this.paginationParserClass(pageContent, url);
  }
}
