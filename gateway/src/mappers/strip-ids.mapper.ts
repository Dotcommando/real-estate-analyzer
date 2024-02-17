export function stripIds(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(stripIds);
  } else if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};

    for (const [ key, value ] of Object.entries(obj)) {
      if (key !== '_id') {
        newObj[key] = stripIds(value);
      }
    }

    return newObj;
  }

  return obj;
}
