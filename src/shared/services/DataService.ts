export type HasId = {
  id: string;
};

export type WithoutId<T> = Omit<T, 'id'>;

// TODO: Implementar store? Como?
export abstract class DataService<T extends HasId> {
  abstract getById(id: string): Promise<T>;
  abstract getAll(): Promise<T[]>;
  abstract add(data: WithoutId<T>): Promise<string>;
  abstract update(id: string, data: Partial<WithoutId<T>>): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract listen(callback: (data: T[]) => void): () => void;
}
