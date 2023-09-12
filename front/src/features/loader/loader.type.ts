export type LoaderKey = 'objects' | 'best-prices';

export type LoaderState = 'idle' | 'loading' | 'loaded';

export type LoaderStore = Record<LoaderKey, LoaderState>;

export type LoaderActionPayload = {
  key: LoaderKey;
  state: LoaderState;
};
