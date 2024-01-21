import { convertTimeToMilliseconds } from './convert-time-to-ms';

import { DAY_MS, HOUR_MS, MINUTE_MS } from '../constants';


describe('convertTimeToMilliseconds', () => {
  it.each([
    [ '1d', DAY_MS ],
    [ '12h', 12 * HOUR_MS ],
    [ '30m', 30 * MINUTE_MS ],
    [ '1d12h', 1.5 * DAY_MS ],
    [ '2d8h40m', (2 * 24 + 8) * HOUR_MS + 40 * MINUTE_MS ],
    [ '1d8m', DAY_MS + 8 * MINUTE_MS ],
    [ '1d08m', DAY_MS + 8 * MINUTE_MS ],
    [ '3d05h03m', (3 * 24 + 5) * HOUR_MS + 3 * MINUTE_MS ],
    [ '', 0 ],
    [ '0d0h0m', 0 ],
    [ '3d', 3 * DAY_MS ],
  ])(
    'should correctly convert "%s" to milliseconds',
    (input, expected) => {
      expect(convertTimeToMilliseconds(input)).toBe(expected);
    },
  );
});
