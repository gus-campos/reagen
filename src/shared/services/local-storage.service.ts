import { IDatabase } from '@/shared/services/base-repository.service';
import { OmitId, WithId } from '@/shared/types/id.type';
import { DatabaseTableName } from '@/shared/types/table-name.type';
import { TABLE_REVIVERS } from '@/shared/utils/revivers';

export class LocalStorageDatabase implements IDatabase {
  // Fila de operações pendentes por tabela
  private operationQueues = new Map<DatabaseTableName, Promise<any>>();

  constructor(private localStorage: Storage) {}

  async get<T extends WithId>(table: DatabaseTableName): Promise<T[]> {
    const data = this.localStorage.getItem(table);
    const items = data ? JSON.parse(data) : [];
    const reviver = TABLE_REVIVERS[table];
    return reviver ? items.map(reviver) : items;
  }

  async create<T extends WithId>(table: DatabaseTableName, item: OmitId<T>): Promise<T> {
    return this.queueOperation(table, async () => {
      const items = await this.get<T>(table);
      const createdItem = { ...item, id: this.generateId(table) } as T;
      const newItems = [...items, createdItem];
      this.localStorage.setItem(table, JSON.stringify(newItems));
      this.notifyChange(table);
      return createdItem;
    });
  }

  async update<T extends WithId>(
    table: DatabaseTableName,
    id: string,
    data: Partial<OmitId<T>>
  ): Promise<void> {
    return this.queueOperation(table, async () => {
      const items = await this.get<T>(table);
      const index = items.findIndex((i) => i.id === id);
      if (index >= 0) {
        items[index] = { ...items[index], ...data };
        this.localStorage.setItem(table, JSON.stringify(items));
      }
      this.notifyChange(table);
    });
  }

  async delete(table: DatabaseTableName, id: string): Promise<void> {
    return this.queueOperation(table, async () => {
      const items = await this.get(table);
      this.localStorage.setItem(table, JSON.stringify(items.filter((i: any) => i.id !== id)));
      this.notifyChange(table);
    });
  }

  async query<T extends WithId>(table: DatabaseTableName, fn: (item: T) => boolean): Promise<T[]> {
    const items = await this.get<T>(table);
    return items.filter(fn);
  }

  listen<T extends WithId>(table: DatabaseTableName, callback: (data: T[]) => void) {
    // 1. snapshot inicial
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

  // Garante que operações na mesma tabela sejam executadas sequencialmente
  private async queueOperation<T>(
    table: DatabaseTableName,
    operation: () => Promise<T>
  ): Promise<T> {
    // Pega a fila atual ou cria uma nova
    const previousOperation = this.operationQueues.get(table) || Promise.resolve();

    // Cria a nova operação encadeada
    const newOperation = previousOperation
      .catch(() => {}) // Ignora erros da operação anterior
      .then(() => operation()); // Executa a operação atual

    // Atualiza a fila (mantém a promise mesmo que rejeite)
    this.operationQueues.set(
      table,
      newOperation.catch(() => {})
    );

    // Retorna o resultado da operação (pode rejeitar)
    return newOperation;
  }
}
