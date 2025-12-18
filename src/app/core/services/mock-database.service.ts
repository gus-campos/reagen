import { Injectable } from '@angular/core';
import { WithId } from '@core/models/base.interface';
import { IDatabase } from './base-repository.service';

@Injectable({ providedIn: 'root' })
export class MockDatabaseService implements IDatabase {
  private storage = window.localStorage;

  get<T>(table: string): T[] {
    const data = this.storage.getItem(table);
    return data ? JSON.parse(data) : [];
  }

  add<T>(table: string, item: T): T {
    const items = this.get<T>(table);
    items.push(item);
    this.storage.setItem(table, JSON.stringify(items));
    return item;
  }

  update<T>(table: string, item: T & WithId): T {
    const items = this.get<T>(table);
    const index = items.findIndex((i: any) => i.id === item.id);
    if (index >= 0) items[index] = item;
    this.storage.setItem(table, JSON.stringify(items));
    return item;
  }

  delete(table: string, id: string): void {
    const items = this.get(table);
    this.storage.setItem(table, JSON.stringify(items.filter((i: any) => i.id !== id)));
  }

  query<T>(table: string, fn: (item: T) => boolean): T[] {
    return this.get<T>(table).filter(fn);
  }
}
