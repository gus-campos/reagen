import { DataTable, TableName } from './tables';

type Reviver<T> = (raw: any) => T;

export const TABLE_REVIVERS: Record<TableName, Reviver<any>> = {
  [DataTable.Vials]: (raw: any) => {
    return {
      ...raw,
      outDate: raw.outDate ? new Date(raw.outDate) : null,
    };
  },
};
