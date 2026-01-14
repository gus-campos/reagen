import { IDatabase } from '@/shared/services/base-repository.service';
import { OmitId, WithId } from '@/shared/types/id.type';
import { DatabaseTableName } from '@/shared/types/table-name.type';
import { TABLE_REVIVERS } from '@/shared/utils/revivers';

export class LocalStorageDatabase implements IDatabase {
  constructor(private localStorage: Storage) {}

  async get<T extends WithId>(table: DatabaseTableName): Promise<T[]> {
    const data = this.localStorage.getItem(table);
    const items = data ? JSON.parse(data) : [];

    const reviver = TABLE_REVIVERS[table];
    return reviver ? items.map(reviver) : items;
  }

  async create<T extends WithId>(table: DatabaseTableName, item: OmitId<T>): Promise<T> {
    const items = await this.get<T>(table);
    const createdVial = { ...item, id: this.generateId(table) } as T;
    items.push(createdVial);
    this.localStorage.setItem(table, JSON.stringify(items));
    this.notifyChange(table);
    return createdVial;
  }

  async update<T extends WithId>(
    table: DatabaseTableName,
    id: string,
    data: Partial<OmitId<T>>
  ): Promise<void> {
    const items = await this.get<T>(table);
    const index = items.findIndex((i) => i.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...data };
      this.localStorage.setItem(table, JSON.stringify(items));
    }
    this.notifyChange(table);
  }

  async delete(table: DatabaseTableName, id: string): Promise<void> {
    const items = await this.get(table);
    this.localStorage.setItem(table, JSON.stringify(items.filter((i: any) => i.id !== id)));
    this.notifyChange(table);
  }

  async query<T extends WithId>(table: DatabaseTableName, fn: (item: T) => boolean): Promise<T[]> {
    const items = await this.get<T>(table);
    return items.filter(fn);
  }

  listen<T extends WithId>(table: DatabaseTableName, callback: (data: T[]) => void) {
    // 1. snapshot inicial - (não entendi por que precisa ser disparado)
    this.get<T>(table).then(callback);

    // 2. mudanças futuras
    const handler = async (e: StorageEvent) => {
      if (e.key !== table) return;
      callback(await this.get<T>(table));
    };

    window.addEventListener('storage', handler);

    return () => window.removeEventListener('storage', handler);
  }

  // HELPERS

  private notifyChange(table: DatabaseTableName) {
    window.dispatchEvent(new StorageEvent('storage', { key: table }));
  }

  private generateId(table: string) {
    return `${table}-${crypto.randomUUID()}`;
  }
}
