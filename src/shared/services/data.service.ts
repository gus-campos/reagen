export type HasId = {
  id: string;
};

export type WithoutId<T> = Omit<T, 'id'>;
