import { OmitId, WithId } from '@core/models/base.interface';
import { from, Observable, of } from 'rxjs';

export abstract class IDatabase {
  abstract get<T extends WithId>(table: string): Promise<T[]>;
  abstract create<T extends WithId>(table: string, item: OmitId<T>): Promise<T>;
  abstract update<T extends WithId>(
    table: string,
    id: string,
    data: Partial<OmitId<T>>
  ): Promise<void>;
  abstract delete(table: string, id: string): Promise<void>;
  abstract query<T extends WithId>(table: string, fn: (item: T) => boolean): Promise<T[]>;
}

export interface IRepository<T extends WithId> {
  getAll(): Observable<T[]>;
  getById(id: string): Observable<T | undefined>;
  create(item: OmitId<T>): Observable<T>;
  update(id: string, item: Partial<OmitId<T>>): Observable<void>;
  delete(id: string): Observable<void>;
}

export abstract class BaseRepository<T extends WithId> implements IRepository<T> {
  constructor(protected db: IDatabase, protected tableName: string) {}

  getAll(): Observable<T[]> {
    return from(this.db.get<T>(this.tableName));
  }

  getById(id: string): Observable<T | undefined> {
    return from(
      this.db.get<T>(this.tableName).then((items) => items.find((i) => i.id === id) ?? undefined)
    );
  }

  create(item: OmitId<T>): Observable<T> {
    return from(this.db.create(this.tableName, item));
  }

  update(id: string, item: Partial<OmitId<T>>): Observable<void> {
    return from(this.db.update(this.tableName, id, item));
  }

  delete(id: string): Observable<void> {
    return from(this.db.delete(this.tableName, id));
  }
}
