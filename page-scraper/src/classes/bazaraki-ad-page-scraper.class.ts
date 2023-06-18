import * as cheerio from 'cheerio';
import * as dashify from 'dashify';
import * as levenshtein from 'fast-levenshtein';
import Root = cheerio.Root;
import { OnlineViewing, OnlineViewingArray } from '../constants';
import { IRealEstate } from '../types';
import { dateInHumanReadableFormat, getRoundYesterday, parseDate, roundDate } from '../utils';


export class BazarakiAdPageScraperClass<T extends IRealEstate> {
  private pageContent: string;
  private $: Root;
  private resultData: Partial<T>;
  private category: string;

  constructor(pageContent: string, url: string) {
    this.pageContent = pageContent;
    this.$ = cheerio.load(pageContent);

    const [ city, district ] = this.getCityDistrict();

    this.resultData = {
      title: this.getTitle(),
      description: this.getDescription(),
      // description: this.$('.announcement-description .js-description').text().trim().substring(0, 30) + '...',
      url,
      publish_date: this.getPublishDate(),
      // publish_date_human_readable: dateInHumanReadableFormat(new Date(this.getPublishDate())),
      city,
      district,
      currency: this.getCurrency(),
      price: this.getPrice(),
      ad_id: this.getAdId(),
      'square-meter-price': this.getSquareMeterPrice(),
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

  private getSquareMeterPrice(): number {
    try {
      const sqMeterPrice = parseFloat(
        this.$('.announcement-price__per-meter')
          .text()
          .trim()
          .replace(/[^\d.]/g, ''),
      );

      return isNaN(sqMeterPrice)
        ? 0
        : sqMeterPrice;
    } catch (e) {
      return 0;
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

  private getCharacteristics(selector: string): Partial<T> {
    try {
      const characteristics: Partial<T> = {};
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

  public getPageData(): [ Partial<T>, string ] {
    return [ this.resultData, this.category ];
  }
}
