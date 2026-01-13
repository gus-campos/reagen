export enum DbTableName {
  Vial = 'vial',
  Box = 'box',
  Reagent = 'reagent',
  Brand = 'brand',
  Package = 'package',
  ControlAgency = 'control-agency',
  Laboratory = 'laboratory',
  Supplier = 'supplier',
}

export type TableName = (typeof DbTableName)[keyof typeof DbTableName];
