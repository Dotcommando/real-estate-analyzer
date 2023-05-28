import * as cheerio from 'cheerio';
import * as dashify from 'dashify';
import * as levenshtein from 'fast-levenshtein';
import Root = cheerio.Root;
import { IRealEstate } from '../types';
import { dateInHumanReadableFormat, getRoundYesterday, parseDate, roundDate } from '../utils';


export class BazarakiAdPageScraperClass<T extends IRealEstate> {
  private pageContent: string;
  private $: Root;
  private resultData: Partial<T>;

  constructor(pageContent: string, url: string) {
    this.pageContent = pageContent;
    this.$ = cheerio.load(pageContent);

    const [ city, district ] = this.getCityDistrict();

    this.resultData = {
      title: this.$('#ad-title').text().trim(),
      description: this.$('.announcement-description .js-description').text().trim(),
      // description: this.$('.announcement-description .js-description').text().trim().substring(0, 30) + '...',
      url,
      publish_date: this.getPublishDate(),
      // publish_date_human_readable: dateInHumanReadableFormat(new Date(this.getPublishDate())),
      city,
      district,
      currency: this.$('.announcement-price__cost meta[itemprop=priceCurrency]').attr('content'),
      price: parseInt(this.$('.announcement-price__cost meta[itemprop=price]').attr('content')),
      ad_id: this.$('.number-announcement span[itemprop=sku]').text().trim(),
      ...(this.getCharacteristics('.announcement-characteristics .chars-column')),
    };
  }

  private getPublishDate(): number {
    const textDate = this.$('.announcement__details .date-meta').text()
      .trim()
      .replace(/[P|p]osted:\s*/, '')
      .replace(/[Y|y]esterday/, dateInHumanReadableFormat(getRoundYesterday(), 'DD.MM.YYYY'))
      .replace(/[T|t]oday/, dateInHumanReadableFormat(roundDate(new Date()), 'DD.MM.YYYY'));

    return parseDate(textDate, 'DD.MM.YYYY HH:mm').getTime();
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

  public getPageData(): Partial<T> {
    return this.resultData;
  }
}
