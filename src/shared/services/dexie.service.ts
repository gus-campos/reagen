import Dexie, { Table } from 'dexie';
import { IDatabase } from '@/shared/services/base-repository.service';
import { OmitId, WithId } from '@/shared/types/id.type';
import { DatabaseTableName } from '@/shared/types/table-name.type';

// Define the Dexie database schema
class ReagenDb extends Dexie {
  vial!: Table;
  reagent!: Table;
  fundingSource!: Table;
  package!: Table;
  ['control-agency']!: Table;
  laboratory!: Table;
  supplier!: Table;

  constructor() {
    super('ReagenDB');
    this.version(1).stores({
      vial: 'id, laboratoryId, packageId, outDate', // Adicione índices para queries rápidas
      reagent: 'id, name, fundingSourceId',
      fundingSource: 'id, name',
      package: 'id, reagentId, createdAt',
      ['control-agency']: 'id, name',
      laboratory: 'id, name',
      supplier: 'id, name',
    });
  }
}

// Listeners registry for real-time updates
type ListenerCallback = (data: any[]) => void;
const listeners = new Map<DatabaseTableName, Set<ListenerCallback>>();

// Create database instance
const db = new ReagenDb();

export class DexieDatabase implements IDatabase {
  async get<T extends WithId>(table: DatabaseTableName): Promise<T[]> {
    const tableRef = db.table(table);
    return (await tableRef.toArray()) as T[];
  }

  async create<T extends WithId>(table: DatabaseTableName, item: OmitId<T>): Promise<T> {
    const tableRef = db.table(table);
    const id = this.generateId(table);
    const createdItem = { ...item, id } as T;
    await tableRef.put(createdItem);
    await this.notifyListeners(table); // Await para garantir ordem
    return createdItem;
  }

  async update<T extends WithId>(
    table: DatabaseTableName,
    id: string,
    data: Partial<OmitId<T>>
  ): Promise<void> {
    const tableRef = db.table(table);
    await tableRef.update(id, data);
    await this.notifyListeners(table); // Await para garantir ordem
  }

  async delete(table: DatabaseTableName, id: string): Promise<void> {
    const tableRef = db.table(table);
    await tableRef.delete(id);
    await this.notifyListeners(table); // Await para garantir ordem
  }

  async query<T extends WithId>(table: DatabaseTableName, fn: (item: T) => boolean): Promise<T[]> {
    const items = await this.get<T>(table);
    return items.filter(fn);
  }

  listen<T extends WithId>(table: DatabaseTableName, callback: (data: T[]) => void): () => void {
    // Initialize listeners set if not exists
    if (!listeners.has(table)) {
      listeners.set(table, new Set());
    }

    // Send initial data
    this.get<T>(table).then(callback);

    // Register listener
    const tableListeners = listeners.get(table)!;
    tableListeners.add(callback);

    // Return unsubscribe function
    return () => {
      tableListeners.delete(callback);
      // Cleanup empty sets
      if (tableListeners.size === 0) {
        listeners.delete(table);
      }
    };
  }

  // Notify all listeners for a table
  private async notifyListeners(table: DatabaseTableName): Promise<void> {
    const tableListeners = listeners.get(table);
    if (!tableListeners) return;

    const tableRef = db.table(table);
    const data = await tableRef.toArray();
    tableListeners.forEach((callback) => callback(data));
  }

  private generateId(table: string): string {
    return `${table}-${crypto.randomUUID()}`;
  }
}
