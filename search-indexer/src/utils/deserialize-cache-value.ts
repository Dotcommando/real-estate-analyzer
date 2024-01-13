export function deserializeCacheValue(value) {
  if (value && typeof value === 'object') {
    if (value.__type === 'Array') {
      return value.value.map(deserializeCacheValue);
    } else if (value.__type === 'Date') {
      return new Date(value.value);
    } else if (value.__type === 'Number') {
      if (value.isNaN) {
        return NaN;
      }
      if (value.isInfinity) {
        return Infinity;
      }
      if (value.isMinusInfinity) {
        return -Infinity;
      }

      return value.value;
    } else if (value.__type === 'String') {
      return value.value;
    } else if (value.__type === 'Null') {
      return null;
    } else if (value.__type === 'Undefined') {
      return undefined;
    } else if (value.__type === 'Object') {
      const result = {};

      for (const key in value) {
        if (key !== '__type') {
          result[key] = deserializeCacheValue(value[key]);
        }
      }

      return result;
    }
  }

  return value;
}
