import { Model } from 'mongoose';

import { IAsyncArrayIterator } from '../types';


export const getBatchIterator = <T>(
  model: Model<T>,
  batchSize: number,
): IAsyncArrayIterator<T[]> => ({
    [Symbol.asyncIterator]() {
      let offset = 0;
      let isDone = false;

      return {
        async next() {
          if (isDone) return { value: undefined, done: true };

          const docs = await model.find({})
            .skip(offset)
            .limit(batchSize)
            .lean() as T[];

          offset += docs.length;
          if (docs.length === 0 || docs.length < batchSize) {
            isDone = true;
          }

          return { value: docs, done: false };
        },
        async return() {
          return { value: undefined, done: true };
        },
      };
    },
  });
