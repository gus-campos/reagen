import { DatabaseTableName, DataBaseTableName } from '@/shared/types/table-name.type';

type Reviver<T> = (raw: any) => T;

// FIXME: Tipagem
export const TABLE_REVIVERS: Record<DataBaseTableName, Reviver<any>> = {
  [DatabaseTableName.Vial]: (raw: any) => {
    return {
      ...raw,
      outDate: raw.outDate ? new Date(raw.outDate) : null,
    };
  },
  [DatabaseTableName.Box]: (raw: any) => {
    return {
      ...raw,
      inDate: raw.inDate ? new Date(raw.inDate) : null,
      expireDate: raw.expireDate ? new Date(raw.expireDate) : null,
    };
  },
  [DatabaseTableName.Reagent]: (raw: any) => raw,
};
