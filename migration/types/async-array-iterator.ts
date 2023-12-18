export interface AsyncIterator<T> {
  next: () => Promise<{ done: false; value: T } | { done: true; value: undefined }>;
  return: () => Promise<{ done: true; value: undefined }>;
}

export interface IAsyncArrayIterator<T> {
  [Symbol.asyncIterator](): AsyncIterator<T>;
}
