import * as cheerio from 'cheerio';
import * as dashify from 'dashify';
import * as levenshtein from 'fast-levenshtein';
import Root = cheerio.Root;
import { AdPageParserAbstract } from './ad-page-parser.abstract';

import { coordsRegexp, OnlineViewing, OnlineViewingArray, Source } from '../constants';
import { IRealEstate } from '../types';
import { dateInHumanReadableFormat, getRoundYesterday, parseDate, roundDate } from '../utils';


export class BazarakiAdPageParser extends AdPageParserAbstract<IRealEstate> {
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
      source: Source.BAZARAKI,
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
      return this.$('#ad-title').text().trim();
    } catch (e) {
      return '';
    }
  }

  private getDescription(): string {
    try {
      return this.$('.announcement-description .js-description')
        .text()
        .trim()
        .replace(/[\s\t ]+/gm, ' ');
    } catch (e) {
      return '';
    }
  }

  private getPublishDate(): number {
    try {
      const textDate = this.$('.announcement__details .date-meta').text()
        .trim()
        .replace(/[P|p]osted:\s*/, '')
        .replace(/[Y|y]esterday/, dateInHumanReadableFormat(getRoundYesterday(), 'DD.MM.YYYY'))
        .replace(/[T|t]oday/, dateInHumanReadableFormat(roundDate(new Date()), 'DD.MM.YYYY'));

      return parseDate(textDate, 'DD.MM.YYYY HH:mm').getTime();
    } catch (e) {
      return roundDate(new Date()).getTime();
    }
  }

  private getCurrency(): string {
    try {
      return this.$('.announcement-price__cost meta[itemprop=priceCurrency]').attr('content');
    } catch (e) {
      return 'EUR';
    }
  }

  private getPrice(): number {
    try {
      const price = parseInt(this.$('.announcement-price__cost meta[itemprop=price]').attr('content'));

      return isNaN(price)
        ? 0
        : price;
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

  private getCharacteristics(selector: string): Partial<IRealEstate> {
    try {
      const characteristics: Partial<IRealEstate> = {};
      const $ = this.$;

      this.$(selector).find('li').each(function() {
        const key = $(this)?.find('.key-chars').text().trim();
        const value = $(this)?.find('.value-chars').text().trim();

        if (key && value) {
          const kebabKey = dashify(key);

          if (kebabKey === 'included' && value !== '') {
            characteristics[kebabKey] = (value.split(',')).map(item => item.trim());
          } else if (kebabKey === 'property-area' || kebabKey === 'bedrooms' || kebabKey === 'bathrooms') {
            characteristics[kebabKey] = parseFloat(value);
          } else if (kebabKey === 'plot-area') {
            const plotAreaText = characteristics[kebabKey].replace(/["']+/gm, '');
            const parsedNumber = parseInt(plotAreaText);

            characteristics[kebabKey] = isNaN(parsedNumber) ? 0 : parsedNumber;

            const plotAreaUnit = plotAreaText.replace(/[\d\t\s]+/gm, '');

            characteristics['plot-area-unit'] = plotAreaUnit !== ''
              ? plotAreaUnit
              : 'm²';
          } else if (kebabKey === 'online-viewing') {
            characteristics[kebabKey] = OnlineViewingArray.includes(characteristics[kebabKey])
              ? characteristics[kebabKey]
              : OnlineViewing.No;
          } else {
            characteristics[kebabKey] = value;
          }
        }
      });

      return characteristics;
    } catch (e) {
      return {};
    }
  }

  private getExpiredStatus(): boolean {
    try {
      const phoneBlockText = this.$('.phone-author .phone-author__subtext')
        .text()
        .trim();

      return phoneBlockText.includes('expired');
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
