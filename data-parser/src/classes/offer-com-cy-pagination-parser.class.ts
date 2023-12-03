import * as cheerio from 'cheerio';
import Root = cheerio.Root;
import { PaginationParserAbstract } from './pagination-parser.abstract';


export class OfferComCyPaginationParser extends PaginationParserAbstract {
  private $: Root;

  constructor(pageContent: string, url: string) {
    super(pageContent, url);

    this.$ = cheerio.load(pageContent);
  }

  public getPaginationUrls(): Set<string> {
    const pagination = new Set<string>();

    this.$('.pagination a').each((index, element) => {
      pagination.add(this.$(element).attr('href') || '');
    });

    pagination.delete('');

    return pagination;
  }

  public getAdsUrls(): Set<string> {
    const ads = new Set<string>();

    this.$('#clsList .item .title-a a').each((index, element) => {
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

    const baseUrl = categoryUrl.split('#')[0];
    const clearCategoryUrl = baseUrl.replace(/([?&])dpn=\d+&?/, '$1');
    const result = new Set<string>();

    for (let i = from; i <= to; i++) {
      const pageNumber = (i - 1) * 10;
      const delimiter = clearCategoryUrl.includes('?') ? '&' : '?';
      const pageUrl = `${clearCategoryUrl}${delimiter}dpn=${pageNumber}`;

      result.add(pageUrl);
    }

    return result;
  }

  public getMaxNumberOfPagination(setOfUrls: Set<string>): number {
    if (!setOfUrls.size) {
      return 0;
    }

    try {
      const maxPageNumber = Array.from(setOfUrls).reduce((prev: number, url: string) => {
        const match = url.match(/[?&]dpn=(\d+)/);
        const pageNumber = match ? parseInt(match[1], 10) : 0;

        return Math.max(prev, pageNumber);
      }, 0);

      return maxPageNumber === 0
        ? 0
        : Math.ceil(maxPageNumber / 10) + 1;
    } catch (e) {
      return 0;
    }
  }
}
