import { IDatabase } from '@/shared/services/base-repository.service';
import { OmitId, WithId } from '@/shared/types/id.type';
import { DataBaseTableName } from '@/shared/types/table-name.type';
import { TABLE_REVIVERS } from '@/shared/utils/revivers';

export class LocalStorageDatabase implements IDatabase {
  private storage = window.localStorage;

  // ------------- Helpers -------------

  private generateId(table: string) {
    return `${table}-${crypto.randomUUID()}`;
  }

  async get<T extends WithId>(table: DataBaseTableName): Promise<T[]> {
    const data = this.storage.getItem(table);
    const vials = data ? JSON.parse(data) : [];

    const reviver = TABLE_REVIVERS[table];
    return reviver ? vials.map(reviver) : vials;
  }

  async create<T extends WithId>(table: DataBaseTableName, vial: OmitId<T>): Promise<T> {
    const vials = await this.get<T>(table);
    const createdVial = { ...vial, id: this.generateId(table) } as T;
    vials.push(createdVial);
    this.storage.setItem(table, JSON.stringify(vials));
    return createdVial;
  }

  async update<T extends WithId>(
    table: DataBaseTableName,
    id: string,
    data: Partial<OmitId<T>>
  ): Promise<void> {
    const vials = await this.get<T>(table);
    const index = vials.findIndex((i) => i.id === id);
    if (index >= 0) {
      vials[index] = { ...vials[index], ...data };
      this.storage.setItem(table, JSON.stringify(vials));
    }
  }

  async delete(table: DataBaseTableName, id: string): Promise<void> {
    const vials = await this.get(table);
    this.storage.setItem(table, JSON.stringify(vials.filter((i: any) => i.id !== id)));
  }

  async query<T extends WithId>(table: DataBaseTableName, fn: (vial: T) => boolean): Promise<T[]> {
    const vials = await this.get<T>(table);
    return vials.filter(fn);
  }
}
