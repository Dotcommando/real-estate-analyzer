import { IAsyncArrayIterator } from '../types';


export const getArrayIterator = <T>(arr: any[]): IAsyncArrayIterator<T> => ({
  [Symbol.asyncIterator]() {
    let i = 0;
    const length = arr.length;

    return {
      next() {
        const done = i === length;
        const value = done ? undefined : arr[i];

        i++;

        return Promise.resolve({ value, done });
      },
      return() {
        // This will be reached if the consumer called 'break' or 'return' early in the loop.
        return Promise.resolve({ value: undefined, done: true });
      },
    };
  },
});


