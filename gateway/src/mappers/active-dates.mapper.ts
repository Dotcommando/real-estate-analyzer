import { IAdsResult } from 'src/types';


export function activeDatesMapper(docs, innerMapper: (date: Date[]) => Date[]): IAdsResult {
  if (!docs.length) {
    return [];
  }

  const result = [];

  for (const doc of docs) {
    const newDoc = {
      ...doc,
      active_dates: doc?.active_dates?.length ? innerMapper(doc.active_dates) : [],
    };

    result.push(newDoc);
  }

  return result;
}
