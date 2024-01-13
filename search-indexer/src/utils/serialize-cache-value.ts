export function serializeCacheValue(value) {
  if (Array.isArray(value)) {
    return {
      __type: 'Array',
      value: value.map(serializeCacheValue),
    };
  } else if (value instanceof Date) {
    return {
      __type: 'Date',
      value: (value as Date).toString(),
    };
  } else if (typeof value === 'number' || value instanceof Number) {
    return {
      __type: 'Number',
      isNaN: isNaN(value as number),
      ...(value === Infinity && { isInfinity: true }),
      ...(value === -Infinity && { isMinusInfinity: true }),
      value,
    };
  } else if (typeof value === 'string' || value instanceof String) {
    return {
      __type: 'String',
      value,
    };
  } else if (value === null || value === undefined) {
    return {
      __type: value === null ? 'Null' : 'Undefined',
    };
  } else if (typeof value === 'object') {
    const result = {
      __type: 'Object',
    };

    for (const key in value) {
      result[key] = serializeCacheValue(value[key]);
    }

    return result;
  }

  return value;
}
