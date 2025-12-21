import { Injectable } from '@angular/core';
import { OmitId, WithId } from '@core/models/base.interface';
import { IDatabase } from './base-repository.service';
import { TABLE_REVIVERS } from '@shared/database/revivers';
import { TableName } from '@shared/database/tables';

@Injectable({ providedIn: 'root' })
export class LocalStorageDatabase implements IDatabase {
  private storage = window.localStorage;

  // ------------- Helpers -------------

  private generateId(table: string) {
    return `${table}-${crypto.randomUUID()}`;
  }

  async get<T extends WithId>(table: TableName): Promise<T[]> {
    const data = this.storage.getItem(table);
    const items = data ? JSON.parse(data) : [];

    const reviver = TABLE_REVIVERS[table];
    return reviver ? items.map(reviver) : items;
  }

  async create<T extends WithId>(table: TableName, item: OmitId<T>): Promise<T> {
    const items = await this.get<T>(table);
    const createdItem = { ...item, id: this.generateId(table) } as T;
    items.push(createdItem);
    this.storage.setItem(table, JSON.stringify(items));
    return createdItem;
  }

  async update<T extends WithId>(
    table: TableName,
    id: string,
    data: Partial<OmitId<T>>
  ): Promise<void> {
    const items = await this.get<T>(table);
    const index = items.findIndex((i) => i.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...data };
      this.storage.setItem(table, JSON.stringify(items));
    }
  }

  async delete(table: TableName, id: string): Promise<void> {
    const items = await this.get(table);
    this.storage.setItem(table, JSON.stringify(items.filter((i: any) => i.id !== id)));
  }

  async query<T extends WithId>(table: TableName, fn: (item: T) => boolean): Promise<T[]> {
    const items = await this.get<T>(table);
    return items.filter(fn);
  }
}
