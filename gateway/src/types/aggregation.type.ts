export type AG_MayBeArray<T> = T | { $in: T[] }
export type AG_MayBeRange<T> = T
  | { $eq: T }
  | { $lt: T }
  | { $lte: T }
  | { $gt: T }
  | { $gte: T }
  | { $lt: T; $gt: T }
  | { $lte: T; $gte: T }
  | { $lte: T; $gt: T }
  | { $lt: T; $gte: T };
