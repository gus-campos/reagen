import { DataTable, TableName } from './tables';

type Reviver<T> = (raw: any) => T;

// FIXME: Tipagem
export const TABLE_REVIVERS: Record<TableName, Reviver<any>> = {
  [DataTable.Vial]: (raw: any) => {
    return {
      ...raw,
      outDate: raw.outDate ? new Date(raw.outDate) : null,
    };
  },
  [DataTable.Box]: (raw: any) => {
    return {
      ...raw,
      inDate: raw.inDate ? new Date(raw.inDate) : null,
      expireDate: raw.expireDate ? new Date(raw.expireDate) : null,
    };
  },
  [DataTable.Reagent]: (raw: any) => raw,
};
