import * as fs from 'fs';
import * as path from 'path';

import { OfferComCyAdPageParser } from './offer-com-cy-ad-page-parser.class';


describe('OfferComCyAdPageParser', () => {
  const htmlTemplate = fs.readFileSync(path.join(__dirname, './mocks/rent-house-01.html'), 'utf8');

  const dateTextsToTest: string[] = [
    'Publish: Today 00:09, views: 25',
    'Publish: 01 Dec 23, views: 25',
    'Publish: 01 Oct 23, views: 104',
    'Publish: 09 Jun 23, views: 98',
    'Publish: 26 Sep 23, views: 591',
  ];

  const expectedTimestamps = dateTextsToTest.map(dateText => {
    if (dateText.includes('Today')) {
      const today = new Date();

      today.setHours(0, 9, 0, 0);

      return today.getTime();
    } else {
      const match = dateText.match(/Publish: (\d{2}) (\w{3}) (\d{2}), views:/);

      if (match) {
        const day = parseInt(match[1], 10);
        const year = 2000 + parseInt(match[3], 10);
        const month = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
          .indexOf(match[2]);
        const date = new Date(year, month, day);

        return date.getTime();
      }
    }

    return null;
  });

  dateTextsToTest.forEach((dateText, index) => {
    test(`should correctly parse publish date from "${dateText}"`, () => {
      const htmlWithDate = htmlTemplate.replace('${dateText}', dateText);
      const parser = new OfferComCyAdPageParser(htmlWithDate, 'https://example.com', 'renthouses');
      const pageData = parser.getPageData();

      expect(pageData.publish_date).toBe(expectedTimestamps[index]);
    });
  });
});
