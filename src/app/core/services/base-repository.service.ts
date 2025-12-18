import { WithId } from '@core/models/base.interface';
import { Observable, of } from 'rxjs';

export abstract class IDatabase {
  abstract get<T>(table: string): T[];
  abstract add<T>(table: string, item: T): T;
  abstract update<T>(table: string, item: T): T;
  abstract delete(table: string, id: string): void;
  abstract query<T>(table: string, fn: (item: T) => boolean): T[];
}

export interface IRepository<T extends WithId> {
  getAll(): Observable<T[]>;
  getById(id: string): Observable<T | null>;
  create(item: Omit<T, 'id'>): Observable<T>;
  update(item: T): Observable<T>;
  delete(id: string): Observable<void>;
}

export abstract class BaseRepository<T extends WithId> implements IRepository<T> {
  constructor(protected db: IDatabase, protected tableName: string) {}

  // TODO: Herdar como EntityId
  // FIXME: Futuramente mover geração pro back
  protected abstract generateId(): string;

  getAll(): Observable<T[]> {
    return of(this.db.get<T>(this.tableName));
  }

  getById(id: string): Observable<T | null> {
    const items = this.db.get<T>(this.tableName);
    return of(items.find((i: T) => i.id === id) || null);
  }

  create(item: Omit<T, 'id'>): Observable<T> {
    const newItem = { ...item, id: this.generateId() } as T;
    return of(this.db.add(this.tableName, newItem));
  }

  update(item: T): Observable<T> {
    return of(this.db.update(this.tableName, item));
  }

  delete(id: string): Observable<void> {
    this.db.delete(this.tableName, id);
    return of(void 0);
  }
}
