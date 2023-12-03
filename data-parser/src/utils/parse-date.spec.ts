import { parseDate } from './parse-date';


describe('parseDate', () => {
  it.each([
    // YYYY
    [ '27.12.2019', 'DD.MM.YYYY', new Date(2019, 11, 27) ],
    [ '27/12/2019 16:55:33', 'DD/MM/YYYY HH:mm:ss', new Date(2019, 11, 27, 16, 55, 33) ],
    [ '27 Dec 2019 8:12', 'DD MMM YYYY H:mm', new Date(2019, 11, 27, 8, 12) ],

    // YY
    [ '27.12.19', 'DD.MM.YY', new Date(2019, 11, 27) ],
    [ '27/12/19 16:55', 'DD/MM/YY HH:mm', new Date(2019, 11, 27, 16, 55) ],
    [ '16:55:33 27 Dec 19', 'HH:mm:ss DD MMM YY', new Date(2019, 11, 27, 16, 55, 33) ],

    // MMM
    [ '27 of Jan 2020 1:55', 'DD of MMM YYYY H:mm', new Date(2020, 0, 27, 1, 55) ],
    [ '27 Dec 20', 'DD MMM YY', new Date(2020, 11, 27) ],
    [ '27 Sep 2020 13:55:33 125', 'DD MMM YYYY HH:mm:ss SSS', new Date(2020, 8, 27, 13, 55, 33, 125) ],

    // MM
    [ '27.12.2020 1:55', 'DD.MM.YYYY H:mm', new Date(2020, 11, 27, 1, 55) ],
    [ '27/12/20', 'DD/MM/YY', new Date(2020, 11, 27) ],
    [ '09/27/2020 13:55:33 125', 'MM/DD/YYYY HH:mm:ss SSS', new Date(2020, 8, 27, 13, 55, 33, 125) ],

    // M
    [ '27.12.2020 1:55', 'DD.M.YYYY H:mm', new Date(2020, 11, 27, 1, 55) ],
    [ '27/9/20', 'DD/M/YY', new Date(2020, 8, 27) ],
    [ '11/27/2020 13:55:33 125', 'M/DD/YYYY HH:mm:ss SSS', new Date(2020, 10, 27, 13, 55, 33, 125) ],

    // DD
    [ '27.12.2020 1:55', 'DD.MM.YYYY H:mm', new Date(2020, 11, 27, 1, 55) ],
    [ '27/09/20', 'DD/MM/YY', new Date(2020, 8, 27) ],
    [ '11/27/2020 13:55:33 125', 'MM/DD/YYYY HH:mm:ss SSS', new Date(2020, 10, 27, 13, 55, 33, 125) ],

    // D
    [ '27.12.2019 1:55', 'D.MM.YYYY H:mm', new Date(2019, 11, 27, 1, 55) ],
    [ '1/09/20', 'D/MM/YY', new Date(2020, 8, 1) ],
    [ '11/27/2020 13:55:33 125', 'MM/D/YYYY HH:mm:ss SSS', new Date(2020, 10, 27, 13, 55, 33, 125) ],

    // HH
    [ '27.12.2019 01:55', 'D.MM.YYYY HH:mm', new Date(2019, 11, 27, 1, 55) ],
    [ '1/09/20 13:57', 'D/MM/YY HH:mm', new Date(2020, 8, 1, 13, 57) ],
    [ '12/27/2020 23:55:33 125', 'MM/D/YYYY HH:mm:ss SSS', new Date(2020, 11, 27, 23, 55, 33, 125) ],

    // H
    [ '27.12.2019 1:55', 'D.MM.YYYY H:mm', new Date(2019, 11, 27, 1, 55) ],
    [ '1/09/20 13:57', 'D/MM/YY H:mm', new Date(2020, 8, 1, 13, 57) ],
    [ '12/27/2020 23:55:33 125', 'MM/D/YYYY H:mm:ss SSS', new Date(2020, 11, 27, 23, 55, 33, 125) ],

    // mm
    [ '27.12.2019 01:55', 'DD.MM.YYYY H:mm', new Date(2019, 11, 27, 1, 55) ],
    [ '01/09/20 13:57', 'DD/MM/YY H:mm', new Date(2020, 8, 1, 13, 57) ],
    [ '12/27/2020 23:55:33 125', 'MM/D/YYYY H:mm:ss SSS', new Date(2020, 11, 27, 23, 55, 33, 125) ],

    // m
    [ '27.12.2019 01:55', 'DD.MM.YYYY H:mm', new Date(2019, 11, 27, 1, 55) ],
    [ '01/09/20 13:1', 'DD/MM/YY H:m', new Date(2020, 8, 1, 13, 1) ],
    [ '12/27/2020 23:9:19 125', 'MM/D/YYYY H:m:ss SSS', new Date(2020, 11, 27, 23, 9, 19, 125) ],

    // ss
    [ '27.12.2019 01:55 18', 'DD.MM.YYYY H:mm ss', new Date(2019, 11, 27, 1, 55, 18) ],
    [ '01/09/20 13:1 05', 'DD/MM/YY H:m ss', new Date(2020, 8, 1, 13, 1, 5) ],
    [ '12/27/2020 23:9:19 125', 'MM/D/YYYY H:m:ss SSS', new Date(2020, 11, 27, 23, 9, 19, 125) ],

    // s
    [ '27.12.2019 01:55 18', 'DD.MM.YYYY H:mm s', new Date(2019, 11, 27, 1, 55, 18) ],
    [ '01/09/20 13:1 5', 'DD/MM/YY H:m s', new Date(2020, 8, 1, 13, 1, 5) ],
    [ '12/27/2020 23:9:1 125', 'MM/D/YYYY H:m:s SSS', new Date(2020, 11, 27, 23, 9, 1, 125) ],

    // SSS
    [ '27.12.2019 01:55 18 001', 'DD.MM.YYYY H:mm s SSS', new Date(2019, 11, 27, 1, 55, 18, 1) ],
    [ '01/09/20 13:1 5 021', 'DD/MM/YY H:m s SSS', new Date(2020, 8, 1, 13, 1, 5, 21) ],
    [ '12/27/2020 23:9:1 125', 'MM/D/YYYY H:m:s SSS', new Date(2020, 11, 27, 23, 9, 1, 125) ],

    // SS
    [ '27.12.2019 01:55 18 01', 'DD.MM.YYYY H:mm s SS', new Date(2019, 11, 27, 1, 55, 18, 1) ],
    [ '01/09/20 13:1 5 21', 'DD/MM/YY H:m s SS', new Date(2020, 8, 1, 13, 1, 5, 21) ],
    [ '12/27/2020 23:9:1 125', 'MM/D/YYYY H:m:s SS', new Date(2020, 11, 27, 23, 9, 1, 125) ],

    // S
    [ '27.12.2019 01:55 18 1', 'DD.MM.YYYY H:mm s S', new Date(2019, 11, 27, 1, 55, 18, 1) ],
    [ '01/09/20 13:1 5 21', 'DD/MM/YY H:m s S', new Date(2020, 8, 1, 13, 1, 5, 21) ],
    [ '12/27/2020 23:9:1.125', 'MM/D/YYYY H:m:s.S', new Date(2020, 11, 27, 23, 9, 1, 125) ],

    // Special dates
    [ '01 Dec 23', 'DD MMM YY', new Date(2023, 11, 1) ],
    [ '01 Oct 23', 'DD MMM YY', new Date(2023, 9, 1) ],
    [ '09 Jun 23', 'DD MMM YY', new Date(2023, 5, 9) ],
    [ '26 Sep 23', 'DD MMM YY', new Date(2023, 8, 26) ],
  ])('should correctly parse date %p with format %p', (dateString, format, expected) => {
    expect(parseDate(dateString, format)).toEqual(expected);
  });

  it('throws an error for invalid date format', () => {
    expect(() => parseDate(null)).toThrow();
    expect(() => parseDate(undefined)).toThrow();
    expect(() => parseDate('')).toThrow();
    expect(() => parseDate('not a date')).toThrow();
  });
});
