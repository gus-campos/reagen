'use client';

import { CrudOperations, DataTable, TableCollumn } from '@/src/components/Table/DataTable';
import { ReagentsFilter } from '../models/reagents-filter';

type TableViewProps<T> = {
  datas?: T[];
  initialCollumns: TableCollumn<T>[];
  crudOperations: CrudOperations<T>;
  search: string;
  filter: ReagentsFilter;
  errorLoading: boolean;
  loading: boolean;
};

export function TableView<T>({
  datas,
  initialCollumns,
  crudOperations,
  search,
  filter,
  errorLoading,
  loading,
}: TableViewProps<T>) {
  return (
    <>
      {/* Coluna dos reagentes */}

      {/* Table */}
      {errorLoading ? (
        <p>ERRO AO CARREGAR DADOS!</p>
      ) : loading ? (
        <p>CARREGANDO DADOS...</p>
      ) : !datas ? (
        <p>NENHUM DADO ENCONTRADO</p>
      ) : (
        <DataTable
          datas={datas}
          initialCollumns={initialCollumns}
          search={search}
          crudOperations={crudOperations}
        />
      )}
    </>
  );
}
