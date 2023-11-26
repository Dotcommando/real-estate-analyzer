export abstract class PaginationParserAbstract {
  protected pageContent: string;
  protected url: string;

  constructor(pageContent: string, url: string) {
    this.pageContent = pageContent;
    this.url = url;
  }

  public abstract getPaginationUrls(): Set<string>;
  public abstract getAdsUrls(): Set<string>;
  public abstract getPaginationAndAds(): [Set<string>, Set<string>];
  public abstract getPaginationUrlsSet(from: number, to: number, categoryUrl: string): Set<string>;
  public abstract getMaxNumberOfPagination(setOfUrls: Set<string>): number;
}
