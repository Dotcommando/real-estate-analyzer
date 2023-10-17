import * as cheerio from 'cheerio';
import Root = cheerio.Root;


export class BazarakiPaginationScraper<T> {
  private pageContent: string;
  private $: Root;

  constructor(pageContent: string, url: string) {
    this.pageContent = pageContent;
    this.$ = cheerio.load(pageContent);
  }

  public getPaginationUrls(): Set<string> {
    const pagination = new Set<string>();

    this.$('ul.number-list a.page-number').each((index, element) => {
      pagination.add(this.$(element).attr('href') || '');
    });

    pagination.delete('');

    return pagination;
  }

  public getAdsUrls(): Set<string> {
    const ads = new Set<string>();

    this.$('.advert .advert__content-title').each((index, element) => {
      ads.add(this.$(element).attr('href') || '');
    });

    ads.delete('');

    return ads;
  }

  public getPaginationAndAds(): [ Set<string>, Set<string> ] {
    return [ this.getPaginationUrls(), this.getAdsUrls() ];
  }
}
