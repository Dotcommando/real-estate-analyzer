import { Injectable } from '@nestjs/common';

import { BazarakiAdPageScraperClass } from '../class';
import { IRealEstate } from '../types';


@Injectable()
export class ParseService {
  public async parsePage(pageData: string, url: string): Promise<Partial<IRealEstate>> {
    return new BazarakiAdPageScraperClass<IRealEstate>(pageData, url).getPageData();
  }
}
