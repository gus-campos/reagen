import { ReactNode } from 'react';

export type TableCollumn<T> = {
  name: string;
  accessor: (data: T) => ReactNode;
  fixed?: boolean;
  sorter?: (a: T, b: T) => number;
};

export type TableCrudOperations<T> = {
  handleDeleteData?: (data: T) => void;
  handleBeginDataEdit?: (data: T) => void;
  handleClickRow?: (vial: T) => void;
  searched?: (data: T) => string;
  dataFilter?: (data: T) => boolean;
  onChangeExpandedData?: (data: T | null) => void;
};
