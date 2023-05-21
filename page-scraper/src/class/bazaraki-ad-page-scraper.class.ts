import * as cheerio from 'cheerio';
import Root = cheerio.Root;
import { IRealEstate } from '../types';
import { dateInHumanReadableFormat, getRoundYesterday, parseDate, roundDate } from '../utils';


export class BazarakiAdPageScraperClass<T extends IRealEstate> {
  private pageContent: string;
  private $: Root;

  private resultData: T;

  constructor(pageContent: string, url: string) {
    this.pageContent = pageContent;
    this.$ = cheerio.load(pageContent);

    const [ city, district ] = this.getCityDistrict();

    // @ts-ignore
    this.resultData = {
      title: this.$('#ad-title').text().trim(),
      description: this.$('.announcement-description .js-description').text().trim(),
      publish_date: this.getPublishDate(),
      city,
    };

    console.dir(this.resultData);
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
    const district = sourceCityDistrict.indexOf(',')


    return [ sourceCityDistrict, sourceCityDistrict ];
  }
}
