import { Timestamp } from 'firebase/firestore';

export type ReplaceDatesWithTimestamps<T> = T extends Date
  ? Timestamp
  : T extends (infer U)[]
    ? ReplaceDatesWithTimestamps<U>[]
    : T extends object
      ? { [K in keyof T]: ReplaceDatesWithTimestamps<T[K]> }
      : T;
