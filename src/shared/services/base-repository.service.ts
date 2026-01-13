import { OmitId, WithId } from '@/shared/types/id.type';
import { DbTableName, TableName } from '@/shared/types/table-name.type';

// Inclui várias tabelas e disponibiliza ações básicas de crud
export interface IDatabase {
  get: <T extends WithId>(table: DbTableName) => Promise<T[]>;
  create: <T extends WithId>(table: DbTableName, item: OmitId<T>) => Promise<T>;
  update: <T extends WithId>(
    table: DbTableName,
    id: string,
    data: Partial<OmitId<T>>
  ) => Promise<void>;
  delete: (table: DbTableName, id: string) => Promise<void>;
  query: <T extends WithId>(table: DbTableName, fn: (item: T) => boolean) => Promise<T[]>;
  listen?: <T extends WithId>(table: DbTableName, callback: (data: T[]) => void) => () => void;
}

// Abstrai o acesso de uma tabela específica em um database específico
export interface IRepository<T extends WithId> {
  getAll: () => Promise<T[]>;
  getById: (id: string) => Promise<T | undefined>;
  create: (item: OmitId<T>) => Promise<T>;
  update: (id: string, item: Partial<OmitId<T>>) => Promise<void>;
  delete: (id: string) => Promise<void>;
  listen: (callback: (data: T[]) => void) => () => void;
}

// Implementação base do repositório para aproveitar comportamento comum
export abstract class BaseRepository<T extends WithId> implements IRepository<T> {
  constructor(
    protected db: IDatabase,
    protected tableName: TableName
  ) {}

  getAll() {
    return this.db.get<T>(this.tableName);
  }

  async getById(id: string) {
    return this.db
      .get<T>(this.tableName)
      .then((items) => items.find((i) => i.id === id) ?? undefined);
  }

  create(item: OmitId<T>) {
    return this.db.create(this.tableName, item);
  }

  update(id: string, item: Partial<OmitId<T>>) {
    return this.db.update(this.tableName, id, item);
  }

  delete(id: string) {
    return this.db.delete(this.tableName, id);
  }

  listen(callback: (data: T[]) => void) {
    if (!this.db.listen) throw new Error('Esse database não possui listen');
    return this.db.listen(this.tableName, callback);
  }
}
