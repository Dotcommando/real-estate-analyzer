import { IAsyncArrayIterator } from '../types';


export const getArrayIterator = <T>(arr: T[]): IAsyncArrayIterator<T> => ({
  [Symbol.asyncIterator]() {
    let i = 0;
    const length = arr.length;

    return {
      next() {
        const done = i === length;
        const value: T | undefined = done ? undefined : arr[i];

        i++;

        return Promise.resolve({ value, done } as { value: T; done: false });
      },
      return() {
        // This will be reached if the consumer called 'break' or 'return' early in the loop.
        return Promise.resolve({ value: undefined, done: true } as { value: undefined; done: true });
      },
    };
  },
});
