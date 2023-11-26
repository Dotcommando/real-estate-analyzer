import { IRealEstate } from '../types';


export abstract class AdPageParserAbstract<T extends IRealEstate> {
  protected pageContent: string;
  protected url: string;

  constructor(pageContent: string, url: string) {
    this.pageContent = pageContent;
    this.url = url;
  }

  public abstract getPageData(): Partial<T>;
}
