import { Injectable } from '@nestjs/common';

import { BazarakiAdPageScraperClass } from '../classes';
import { IRealEstate } from '../types';


@Injectable()
export class ParseService {
  public async parsePage(pageData: string, url: string): Promise<[ Partial<IRealEstate>, string ]> {
    return new BazarakiAdPageScraperClass<IRealEstate>(pageData, url).getPageData();
  }
}
