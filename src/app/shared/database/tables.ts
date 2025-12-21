export enum DataTable {
  Vial = 'vial',
  Box = 'box',
  Reagent = 'reagent',
}

export type TableName = (typeof DataTable)[keyof typeof DataTable];
