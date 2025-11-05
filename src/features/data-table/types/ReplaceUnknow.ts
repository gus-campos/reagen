export type ReplaceUnknown<Obj, T> = {
  [K in keyof Obj]: Obj[K] extends (infer U)[]
    ? ReplaceUnknown<U, T>[]
    : Obj[K] extends (...args: any[]) => any
      ? Obj[K]
      : Obj[K] extends object
        ? Obj[K] extends infer O
          ? O extends unknown
            ? unknown extends O
              ? T
              : { [P in keyof O]: ReplaceUnknown<O[P], T> }
            : never
          : never
        : Obj[K] extends unknown
          ? unknown extends Obj[K]
            ? T
            : Obj[K]
          : Obj[K];
};
