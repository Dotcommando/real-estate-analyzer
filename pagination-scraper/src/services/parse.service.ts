import { Injectable } from '@nestjs/common';

import { BazarakiPaginationScraper } from '../classes';
import { IPaginationPageList } from '../types';


@Injectable()
export class ParseService {
  public async parsePage(pageData: string, url: string): Promise<[ Partial<IPaginationPageList>, string ]> {
    return new BazarakiPaginationScraper<IPaginationPageList>(pageData, url).getPaginationList();
  }
}
