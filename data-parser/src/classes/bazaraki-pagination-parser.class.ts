import * as cheerio from 'cheerio';
import Root = cheerio.Root;
import { PaginationParserAbstract } from './pagination-parser.abstract';


export class BazarakiPaginationParser extends PaginationParserAbstract {
  private $: Root;

  constructor(pageContent: string, url: string) {
    super(pageContent, url);

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

  public getPaginationUrlsSet(from: number, to: number, categoryUrl: string): Set<string> {
    if (from > to) {
      return new Set<string>();
    }

    const clearCategoryUrl = categoryUrl.replace(/[?&]{1}page=[\d]{1,}$/, '');
    const result = new Set<string>();
    const delimiter = clearCategoryUrl.substring(clearCategoryUrl.length - 1) === '/'
      ? ''
      : '/';

    for (let i = from; i <= to; i++) {
      result.add(`${clearCategoryUrl}${delimiter}?page=${i}`);
    }

    return result;
  }

  public getMaxNumberOfPagination(setOfUrls: Set<string>): number {
    if (!setOfUrls.size) {
      return 0;
    }

    try {
      const arrayOfUrls = Array.from(setOfUrls);
      const maxPageNumber = arrayOfUrls.reduce((prev: number, curr: string) => {
        const currPageNumberString = Number(curr.match(/[\d]*$/)?.[0]);
        const currPageNumber = !isNaN(currPageNumberString)
          ? Number(currPageNumberString)
          : 0;

        return Math.max(prev, currPageNumber);
      }, 0);

      return isNaN(maxPageNumber) ? 0 : maxPageNumber;
    } catch (e) {
      return 0;
    }
  }
}
