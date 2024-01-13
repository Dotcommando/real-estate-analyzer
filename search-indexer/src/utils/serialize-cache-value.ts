export function serializeCacheValue(value) {
  if (Array.isArray(value)) {
    return {
      __t: 'A',
      __v: value.map(serializeCacheValue),
    };
  } else if (value instanceof Date) {
    return {
      __t: 'D',
      __v: (value as Date).getTime(),
    };
  } else if (typeof value === 'number' || value instanceof Number) {
    return {
      __t: 'N',
      ...(isNaN(value as number) && { isNaN: true }),
      ...(value === Infinity && { isInfinity: true }),
      ...(value === -Infinity && { isMinusInfinity: true }),
      __v: value,
    };
  } else if (typeof value === 'string' || value instanceof String) {
    return {
      __t: 'S',
      __v: value,
    };
  } else if (value === null || value === undefined) {
    return {
      __t: value === null ? 'Nl' : 'Un',
    };
  } else if (typeof value === 'boolean') {
    return {
      __t: 'B',
      __v: value,
    };
  } else if (typeof value === 'object') {
    const result = {
      __t: 'O',
    };

    for (const key in value) {
      result[key] = serializeCacheValue(value[key]);
    }

    return result;
  }

  return value;
}
