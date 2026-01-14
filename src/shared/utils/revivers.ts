import { DatabaseTableName } from '@/shared/types/table-name.type';

type Reviver<T> = (raw: any) => T;

// FIXME: Tipagem
export const TABLE_REVIVERS: Record<DatabaseTableName, Reviver<any>> = {
  [DatabaseTableName.Vial]: (raw: any) => {
    return {
      ...raw,
      outDate: raw.outDate ? new Date(raw.outDate) : null,
    };
  },
  [DatabaseTableName.Package]: (raw: any) => {
    return {
      ...raw,
      inDate: raw.inDate ? new Date(raw.inDate) : null,
      expireDate: raw.expireDate ? new Date(raw.expireDate) : null,
    };
  },
  [DatabaseTableName.Reagent]: (raw: any) => raw,
  [DatabaseTableName.Brand]: (raw: any) => raw,
  [DatabaseTableName.ControlAgency]: (raw: any) => raw,
  [DatabaseTableName.Laboratory]: (raw: any) => raw,
  [DatabaseTableName.Supplier]: (raw: any) => raw,
};
