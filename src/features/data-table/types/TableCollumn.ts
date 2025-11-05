import { ReactNode } from 'react';

export type TableCollumn<T> = {
  name: string;
  accessor: (data: T) => ReactNode;
  fixed?: boolean;
  sorter?: (a: T, b: T) => number;
  sortingPriority?: number | null;
};
