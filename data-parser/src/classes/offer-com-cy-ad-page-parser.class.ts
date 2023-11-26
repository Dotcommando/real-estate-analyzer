import * as cheerio from 'cheerio';
import * as levenshtein from 'fast-levenshtein';
import Root = cheerio.Root;

import { AdPageParserAbstract } from './ad-page-parser.abstract';

import { coordsRegexp, Source } from '../constants';
import { IRealEstate } from '../types';
import { dateInHumanReadableFormat, getRoundYesterday, parseDate, roundDate } from '../utils';


export class OfferComCyAdPageParser extends AdPageParserAbstract<IRealEstate> {
  private $: Root;
  private resultData: Partial<IRealEstate>;
  private category: string;

  constructor(pageContent: string, url: string) {
    super(pageContent, url);

    this.$ = cheerio.load(pageContent);

    const [ city, district ] = this.getCityDistrict();

    this.resultData = {
      title: this.getTitle(),
      description: this.getDescription(),
      // description: this.$('.announcement-description .js-description').text().trim().substring(0, 30) + '...',
      url,
      publish_date: this.getPublishDate(),
      source: Source.OFFER,
      // publish_date_human_readable: dateInHumanReadableFormat(new Date(this.getPublishDate())),
      city,
      district,
      currency: this.getCurrency(),
      price: this.getPrice(),
      ad_id: this.getAdId(),
      expired: this.getExpiredStatus(),
      coords: this.getCoords(),
      ...(this.getCharacteristics('.announcement-characteristics .chars-column')),
    };

    this.category = this.$('.breadcrumbs > li:last-child > a').attr('href');
  }

  private getTitle(): string {
    try {
      return this.$('#clsdetblo h1').text().trim();
    } catch (e) {
      return '';
    }
  }

  private getDescription(): string {
    try {
      return this.$('#clsdetblo .top_mar_b.e_b')
        .text()
        .replace('Information from owner', '')
        .trim()
        .replace(/[\s\t ]+/gm, ' ');
    } catch (e) {
      return '';
    }
  }

  private getPublishDate(): number {
    try {
      const publishText = this.$('#clsdetblo .col_a small').first().text();
      const dateMatch = publishText.match(/Publish:\s*(.*?), views:/);

      if (!dateMatch || !dateMatch[1]) {
        return roundDate(new Date()).getTime();
      }

      let publishDateStr = dateMatch[1].trim();
      const currentTime = new Date();

      if (publishDateStr.startsWith('Today')) {
        publishDateStr = publishDateStr.replace('Today', dateInHumanReadableFormat(currentTime, 'DD MMM YY'));
      } else if (publishDateStr.startsWith('Yesterday')) {
        const yesterday = getRoundYesterday();

        publishDateStr = publishDateStr.replace('Yesterday', dateInHumanReadableFormat(yesterday, 'DD MMM YY'));
      }

      const publishDate = parseDate(publishDateStr, 'DD MMM YY HH:mm');

      return publishDate.getTime();
    } catch (e) {
      return roundDate(new Date()).getTime();
    }
  }

  private getCurrency(): string {
    try {
      const priceText = this.$('#clsdetblo .ad_price').text();
      const currencySymbol = priceText.match(/[€$£]/);

      switch (currencySymbol ? currencySymbol[0] : null) {
        case '€':
          return 'EUR';

        case '$':
          return 'USD';

        case '£':
          return 'GBP';

        default:
          return 'EUR';
      }
    } catch (e) {
      return 'EUR';
    }
  }


  private getPrice(): number {
    try {
      const priceText = this.$('#clsdetblo .ad_price').text();
      const cleanedPriceText = priceText.replace(/[^0-9]/g, '');
      const price = parseFloat(cleanedPriceText);

      return isNaN(price) ? 0 : price;
    } catch (e) {
      return 0;
    }
  }

  private getAdId(): string {
    try {
      return this.$('.number-announcement span[itemprop=sku]').text().trim();
    } catch (e) {
      return '';
    }
  }

  private getCityDistrict(): [ string, string? ] {
    const sourceCityDistrict = this.$('.announcement-meta span[itemprop=address]').text().trim();

    if (sourceCityDistrict.indexOf(',') === -1) return [ sourceCityDistrict ];

    const splitSource = sourceCityDistrict.split(', ');
    const city = splitSource[0].trim();
    const district = splitSource[1].trim();

    if (city === district) {
      return [ city ];
    }

    if (district.indexOf('-') === -1 && district.indexOf(' ')) {
      return [ city, district ];
    }

    const splitDistrict = district.split('-');
    const subDistrict1 = splitDistrict[0].trim();

    splitDistrict.shift();

    const subDistrict2 = splitDistrict.join('-').trim();

    if (subDistrict1 === city || levenshtein.get(city, subDistrict1) === 1) {
      return [ city, subDistrict2 ];
    }

    return [ city, district ];
  }

  private parseTableToJSON(selector: string): { [key: string]: string } {
    const tableData: { [key: string]: string } = {};

    this.$(selector).find('tr').each((_, element) => {
      const key = this.$(element).find('td').first().text().trim();
      const value = this.$(element).find('td').last().text().trim();

      tableData[key] = value;
    });

    return tableData;
  }

  private getCharacteristics(selector: string): Partial<IRealEstate> & { [key: string]: unknown } {
    try {
      const tableData = this.parseTableToJSON(selector);
      const characteristics: Partial<IRealEstate> & { [key: string]: unknown } = {};

      for (const [ key, value ] of Object.entries(tableData)) {
        switch (key) {
          case 'Bedroom(s)':
            characteristics.bedrooms = parseInt(value);

            break;

          case 'Toilets':
            characteristics.toilets = parseInt(value);

            break;

          case 'Energy Efficiency':
            characteristics['energy-efficiency'] = value;

            break;

          case 'Plot area (sqm)':
            characteristics['plot-area'] = parseInt(value);
            characteristics['plot-area-unit'] = 'm²';

            break;

          case 'Covered area (sqm)':
            characteristics['property-area'] = parseInt(value);
            characteristics['property-area-unit'] = 'm²';

            break;

          case 'Listing ID:':
            characteristics['reference-number'] = value;

            break;

          case 'Furnished':
            characteristics.furnishing = value;

            break;

          case 'Year':
            characteristics['construction-year'] = value;

            break;

          case 'Suitable for':
            characteristics['type'] = value;
        }
      }

      return characteristics;
    } catch (e) {
      return {};
    }
  }

  private getExpiredStatus(): boolean {
    try {
      const isTitleStriked = this.$('.det-head.delet').length > 0;
      const isNoLongerAvailableTextPresent = this.$('#clsdetblo p.col_red strong')
        .text()
        .includes('This classified is no longer available.');

      return isTitleStriked || isNoLongerAvailableTextPresent;
    } catch (e) {
      return false;
    }
  }


  private getCoords(): { lat: number; lng: number } {
    try {
      const coordsData = this.$('.announcement__location').data('coords');

      if (!coordsData) {
        return null;
      }

      const coords = coordsData.match(coordsRegexp())?.[0]
        ?.replace(/[\(\)]/, '')
        ?.split(/\s{1,2}/);
      const lng = parseFloat(coords[0]);
      const lat = parseFloat(coords[1]);

      return !isNaN(lng) && !isNaN(lat)
        ? { lat, lng }
        : null;
    } catch (e) {
      return null;
    }
  }

  public getPageData(): Partial<IRealEstate> {
    return this.resultData;
  }
}
