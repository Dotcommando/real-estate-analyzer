export function deserializeCacheValue(value) {
  if (value && typeof value === 'object') {
    if (value.__t === 'A') {
      return value.__v.map(deserializeCacheValue);
    } else if (value.__t === 'D') {
      return new Date(value.__v);
    } else if (value.__t === 'N') {
      if (value.isNaN) {
        return NaN;
      }
      if (value.isInfinity) {
        return Infinity;
      }
      if (value.isMinusInfinity) {
        return -Infinity;
      }

      return value.__v;
    } else if (value.__t === 'S') {
      return value.__v;
    } else if (value.__t === 'Nl') {
      return null;
    } else if (value.__t === 'Un') {
      return undefined;
    } else if (value.__t === 'B') {
      return value.__v === true || value.__v === 'true';
    } else if (value.__t === 'O') {
      const result = {};

      for (const key in value) {
        if (key !== '__t') {
          result[key] = deserializeCacheValue(value[key]);
        }
      }

      return result;
    }
  }

  return value;
}
