'use client';

import { DataTable } from '@/src/components/Crud/Table/DataTable';

export type TableCollumn<T> = {
  name: string;
  accessor: (data: T) => string;
  fixed?: boolean;
  sorter?: (a: T, b: T) => number;
  sortingPriority?: number | null;
};

export type CrudOperations<T> = {
  handleDeleteData: (data: T) => void;
  handleBeginDataEdit: (data: T) => void;
  handleShowData: (data: T) => void;
  handleClickRow?: (item: T) => void;
  searched?: (data: T) => string;
  dataFilter?: (data: T) => boolean;
};

type TableViewProps<T> = {
  datas: T[];
  initialCollumns: TableCollumn<T>[];
  crudOperations?: CrudOperations<T>;
  search?: string;
  searched?: (data: T) => string;
  dataFilter?: (data: T) => boolean;
};

export function TableView<T>(props: TableViewProps<T>) {
  return (
    <>
      {/* Table */}

      <DataTable
        datas={props.datas}
        columns={props.initialCollumns}
        crudOperations={props.crudOperations}
        search={props.search}
        searched={props.searched}
        dataFilter={props.dataFilter}
      />
    </>
  );
}
