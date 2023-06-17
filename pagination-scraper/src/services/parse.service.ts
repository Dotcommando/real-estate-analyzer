import { Injectable } from '@nestjs/common';

import { BazarakiPaginationScraper } from '../classes';


@Injectable()
export class ParseService {
  public async parsePage(pageData: string, url: string): Promise<[ Set<string>, Set<string> ]> {
    return new BazarakiPaginationScraper(pageData, url).getPaginationAndAds();
  }
}
