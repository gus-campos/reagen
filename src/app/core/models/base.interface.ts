export interface WithId {
  id: string;
}

export type OmitId<T> = Omit<T, 'id'>;
