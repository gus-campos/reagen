import { createContext, ReactNode, useContext, useState } from 'react';
import { TableCollumn } from '../types/TableCollumn';
import { TableCrudOperations } from '../types/TableCrudOperations';

export type DataTableContextType = {
  collumns: TableCollumn<unknown>[];
  hiddenCollumns: string[];
  crudOperations?: TableCrudOperations<unknown>;
  onHideCollumn: (collumnName: string) => void;
  onShowCollumn: (collumnName: string) => void;
  onToggleSorting: (collumnName: string) => void;
  getExpandedComponent?: (data: unknown) => ReactNode;
  actionsCollumnNeeded: boolean;
};

export type DataTableRealContextType<T> = {
  collumns: TableCollumn<T>[];
  hiddenCollumns: string[];
  crudOperations?: TableCrudOperations<T>;
  onHideCollumn: (collumnName: string) => void;
  onShowCollumn: (collumnName: string) => void;
  onToggleSorting: (collumnName: string) => void;
  getExpandedComponent?: (data: T) => ReactNode;
  actionsCollumnNeeded: boolean;
};

export const DataTableContext = createContext<DataTableContextType | null>(null);

export function useDataTableContext() {
  const context = useContext(DataTableContext);
  if (!context) throw new Error('Hook usado fora do Provider');
  return context;
}
