export enum DataTable {
  Vials = 'vials',
}

export type TableName = (typeof DataTable)[keyof typeof DataTable];
