import * as cloneDeep from 'lodash.clonedeep';


function prepareDoc(doc: { [n: string]: any }) {
  return JSON.parse(JSON.stringify(doc));
}

export class DocComparison {
  private indexedCount = 0;
  private indexes: number[] = [];
  private samples = { before: [], after: []};

  constructor(private count: number = 5) {}

  public detectElementsBefore(ads: Partial<Document>[], condition: (ad: Document) => boolean = (ad: Document) => true) {
    const length = ads.length;

    for (let i = 0; i < length; i++) {
      if (this.indexedCount === this.count) {
        break;
      }

      if (!condition(ads[i] as Document)) {
        continue;
      }

      this.indexedCount++;
      this.indexes.push(i);

      const docToCopy = prepareDoc(ads[i]);

      this.samples.before.push(cloneDeep(docToCopy));
    }
  };

  public detectElementsAfter(ads: Partial<Document>[]) {
    for (const index of this.indexes) {
      const docToCopy = prepareDoc(ads[index]);

      this.samples.after.push(cloneDeep(docToCopy));
    }
  };

  public compare(
    log: (...args: any) => void,
    fieldCharsCount = 18,
    valueCharsCount = 24,
    spaceBetweenCount = 4,
  ) {
    function getAllKeys(
      obj1: { [n: string]: any } | null | undefined,
      obj2: { [n: string]: any } | null | undefined,
      keyPrefix = '',
    ): string[] {
      let keys: string[] = [];
      let beforeKeys = Boolean(obj1) ? Object.keys(obj1) : [];
      let afterKeys = Boolean(obj2) ? Object.keys(obj2) : [];

      if (beforeKeys.includes('_id') || afterKeys.includes('_id')) {
        keys.push(keyPrefix + '_id');
        beforeKeys = beforeKeys.filter((el) => el !== '_id');
        afterKeys = afterKeys.filter((el) => el !== '_id');
      }

      if (beforeKeys.includes('id') || afterKeys.includes('id')) {
        keys.push(keyPrefix + 'id');
        beforeKeys = beforeKeys.filter((el) => el !== 'id');
        afterKeys = afterKeys.filter((el) => el !== 'id');
      }

      keys = [ ...keys, ...(beforeKeys.map(el => keyPrefix + el)) ];

      for (const key of afterKeys) {
        if (!keys.includes(key)) {
          keys.push(keyPrefix + key);
        }
      }

      return keys;
    }

    function wrapString(padBefore = 0, value: string, maxSize = 12): string {
      const before = padBefore > 0
        ? ' '.padEnd(padBefore, ' ')
        : '';
      const after = ' '.padEnd(maxSize, ' ');

      return (before + value + after).substring(0, maxSize);
    }

    const spacer = ''.padEnd(spaceBetweenCount, ' ');

    for (let i = 0; i < this.indexes.length; i++) {
      const beforeElement = this.samples.before[i];
      const afterElement = this.samples.after[i];

      log('');
      log('');
      log('');

      const keys: string[] = getAllKeys(beforeElement, afterElement);

      log(wrapString(0, '', fieldCharsCount) + spacer + wrapString(0, 'Object 1', valueCharsCount) + spacer + wrapString(0, 'Object 2', valueCharsCount));

      for (const key of keys) {
        if (typeof beforeElement[key] !== 'object' && typeof afterElement[key] !== 'object') {
          const valueBefore = key in beforeElement
            ? beforeElement[key]
            : '<not set>';
          const valueAfter = key in afterElement
            ? afterElement[key]
            : '<not set>';

          log(wrapString(0, key, fieldCharsCount - 1) + ':' + spacer + wrapString(0, valueBefore, valueCharsCount) + spacer + wrapString(0, valueAfter, valueCharsCount));
        }
      }
    }
  };
}
