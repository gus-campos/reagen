import { Timestamp } from 'firebase/firestore';

export type ReplaceDatesWithTimestamps<T> =
  // Se o tipo for Date (ou incluir Date em união)
  T extends Date | null | undefined
    ? Timestamp
    : // Se for um array, aplica recursivamente nos elementos
      T extends (infer U)[]
      ? ReplaceDatesWithTimestamps<U>[]
      : // Se for um objeto, aplica recursivamente em cada chave
        T extends object
        ? { [K in keyof T]: ReplaceDatesWithTimestamps<T[K]> }
        : // Caso contrário, mantém o tipo original
          T;
