import { Injectable } from '@nestjs/common';

import { BazarakiAdPageScraperClass } from '../class';


@Injectable()
export class ParseService {
  public parsePage(pageData: string, url: string) {
    return new BazarakiAdPageScraperClass(pageData, url);
  }
}
