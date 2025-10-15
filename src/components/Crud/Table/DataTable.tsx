import React, { useEffect, useState } from 'react';
import { Paper, Table } from '@mantine/core';
import { CrudOperations, TableCollumn } from '@/src/components/Crud/Table/TableView';
import { TableRow } from './TableRow';
import { TableThead } from './TableThead';

// Função auxiliar da busca
const normalizeString = (str: string) => {
  return str
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

const searchMatch = (serched: string, searchTerm: string) => {
  return normalizeString(serched).includes(normalizeString(searchTerm));
};

type TableProps<T> = {
  datas: T[];
  columns: TableCollumn<T>[];
  crudOperations?: CrudOperations<T>;
  search?: string;
  searched?: (data: T) => string;
  dataFilter?: (data: T) => boolean;
};

export function DataTable<T>(props: TableProps<T>) {
  const [sortedBy, setSortedBy] = useState<string | null>(null);
  const [sortedAscending, setSortedAscending] = useState<boolean | null>(null);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);

  const handleHideCollumn = (collumnName: string) => {
    if (hiddenColumns.includes(collumnName)) return;
    setHiddenColumns([...hiddenColumns, collumnName]);
  };

  const handleShowCollumn = (collumnName: string) => {
    setHiddenColumns(hiddenColumns.filter((name) => name !== collumnName));
  };

  const handleToggleSorting = (collumnName: string) => {
    const newSortedAscending = sortedAscending === null ? false : !sortedAscending ? true : null;
    const newSortedBy = newSortedAscending === null ? null : collumnName;

    setSortedAscending(newSortedAscending);
    setSortedBy(newSortedBy);
  };

  const sortedDatas = props.datas.sort((a, b) => {
    const sortingCollumn = props.columns.find((collum) => collum.name === sortedBy) ?? null;
    if (!sortingCollumn) return -1;
    const result = sortingCollumn.sorter ? sortingCollumn.sorter(a, b) : 0;
    return sortedAscending ? -result : result;
  });

  return (
    <Paper radius="sm" withBorder style={{ overflow: 'hidden' }}>
      <Table tabularNums striped highlightOnHover>
        <TableThead
          collumns={props.columns}
          hiddenColunms={hiddenColumns}
          sortedAscending={sortedAscending}
          sortedBy={sortedBy}
          onHideCollumn={handleHideCollumn}
          onShowCollumn={handleShowCollumn}
          onToggleSorting={handleToggleSorting}
        />

        <Table.Tbody>
          {sortedDatas
            .filter((data) =>
              props.search && props.searched
                ? searchMatch(props.searched(data), props.search)
                : true
            )
            .filter((data) => (props.dataFilter ? props.dataFilter(data) : true))
            .map((data, index) => (
              <TableRow
                key={index}
                data={data}
                hiddenColunms={hiddenColumns}
                collumns={props.columns}
                crudOperations={props.crudOperations}
                handleClick={
                  props.crudOperations?.handleClickRow
                    ? () => props.crudOperations?.handleClickRow!(data)
                    : undefined
                }
              />
            ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
