'use client';

import { DataTable } from '../components/DataTable';
import { TableCollumn } from '../types/TableCollumn';
import { TableCrudOperations } from '../types/TableCrudOperations';

type TableViewProps<T> = {
  datas: T[];
  initialCollumns: TableCollumn<T>[];
  crudOperations?: TableCrudOperations<T>;
  search?: string;
  searched?: (data: T) => string;
  dataFilter?: (data: T) => boolean;
};

export function TableView<T>(props: TableViewProps<T>) {
  return (
    <DataTable
      datas={props.datas}
      collumns={props.initialCollumns}
      crudOperations={props.crudOperations}
      search={props.search}
      searched={props.searched}
      dataFilter={props.dataFilter}
    />
  );
}
