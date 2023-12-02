import { IRealEstate } from '../types';


export abstract class AdPageParserAbstract<T extends IRealEstate> {
  protected pageContent: string;
  protected url: string;
  protected collection: string;

  constructor(pageContent: string, url: string, collection: string) {
    this.pageContent = pageContent;
    this.url = url;
    this.collection = collection;
  }

  public abstract getPageData(): Partial<T>;
}
