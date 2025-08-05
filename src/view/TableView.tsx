'use client';

import { DataTable } from '@/src/components/Crud/Table/DataTable';

export type TableCollumn<T> = {
  name: string;
  accessor: (data: T) => string;
  fixed?: boolean;
  hidden?: boolean;
  ascending?: boolean | null;
  sorter?: (a: T, b: T) => number;
  sortingPriority?: number | null;
};

export type CrudOperations<T> = {
  handleDeleteData: (data: T) => void;
  handleBeginDataEdit: (data: T) => void;
  handleShowData: (data: T) => void;
};

type TableViewProps<T> = {
  datas?: T[];
  initialCollumns: TableCollumn<T>[];
  crudOperations?: CrudOperations<T>;
  search?: string;
  searched?: (data: T) => string;
  dataFilter?: (data: T) => boolean;
  errorLoading?: boolean;
  loading?: boolean;
};

export function TableView<T>(props: TableViewProps<T>) {
  return (
    <>
      {/* Coluna dos reagentes */}

      {/* Table */}
      {props.errorLoading ? (
        <p>ERRO AO CARREGAR DADOS!</p>
      ) : props.loading ? (
        <p>CARREGANDO DADOS...</p>
      ) : !props.datas ? (
        <p>NENHUM DADO ENCONTRADO</p>
      ) : (
        <DataTable
          datas={props.datas}
          initialCollumns={props.initialCollumns}
          crudOperations={props.crudOperations}
          search={props.search}
          searched={props.searched}
          dataFilter={props.dataFilter}
        />
      )}
    </>
  );
}
