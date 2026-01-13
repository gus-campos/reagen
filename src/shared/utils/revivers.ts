import { DbTableName, TableName } from '@/shared/types/table-name.type';

type Reviver<T> = (raw: any) => T;

// FIXME: Tipagem
export const TABLE_REVIVERS: Record<TableName, Reviver<any>> = {
  [DbTableName.Vial]: (raw: any) => {
    return {
      ...raw,
      outDate: raw.outDate ? new Date(raw.outDate) : null,
    };
  },
  [DbTableName.Box]: (raw: any) => {
    return {
      ...raw,
      inDate: raw.inDate ? new Date(raw.inDate) : null,
      expireDate: raw.expireDate ? new Date(raw.expireDate) : null,
    };
  },
  [DbTableName.Reagent]: (raw: any) => raw,
};
