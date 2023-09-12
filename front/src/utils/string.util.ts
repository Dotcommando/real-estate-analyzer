/** TODO: прописать для условий исключение для toSnake, потому что X превращается в _x */
/** И в toCamel видимо тоже */
const camelWhiteListPredicates: { (s: string): boolean }[] = [
  /** Пришлось добавить этот кейс, потому что функция превращала
   * ключ вида 'a1111-b2222-c3333-d4444' в 'a1111B2222C3333D4444'
   */
  (s: string) => s.includes('-'),
  /** simple_condition при получении inputValues превращается в simpleCondition, и после этого все ломается, пока что добавим исключение */
  (s: string) => s === 'simple_condition',
];

const snakeWhiteListPredicates: { (s: string): boolean }[] = [];

const toCamel = (s: string) => {
  if (camelWhiteListPredicates.some((predicate) => predicate(s))) return s;

  return s.replace(/([-_][a-z])/gi, ($1) => {
    // Пофиксить борьбу prettier и lint
    // eslint-disable-next-line newline-per-chained-call
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });
};

const toSnake = (str: string) => {
  if (snakeWhiteListPredicates.some((predicate) => predicate(str))) return str;

  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isArray = (a: any) => {
  return Array.isArray(a);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isObject = (o: any) => {
  return o === Object(o) && !isArray(o) && typeof o !== 'function';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const keysToCamel = (o: any) => {
  if (isObject(o)) {
    const n = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.keys(o).forEach((k: any) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      n[toCamel(k)] = keysToCamel(o[k]);
    });

    return n;
  }
  if (isArray(o)) {
    return o.map((i: object) => {
      return keysToCamel(i);
    });
  }

  return o;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const keysToSnake = (o: any) => {
  if (isObject(o)) {
    const n = {};

    Object.keys(o).forEach((k) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      n[toSnake(k)] = keysToSnake(o[k]);
    });

    return n;
  }
  if (isArray(o)) {
    return o.map((i: object) => {
      return keysToSnake(i);
    });
  }

  return o;
};

// TODO: добавить генерик на возрващаемый тип, чтобы не пропадала типизация
export const mapObjectKeysToCase = (
  transformCase: 'camel' | 'snake',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  switch (transformCase) {
    case 'camel':
      return keysToCamel(object);
    case 'snake':
      return keysToSnake(object);
    default:
      return object;
  }
};

export const getUuidFromLatex = (latex: string): string[] =>
  latex.match(
    /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/g,
  ) || [];
