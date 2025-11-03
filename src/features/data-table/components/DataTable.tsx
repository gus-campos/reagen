import React, { ReactNode, useState } from 'react';
import { Paper, Table } from '@mantine/core';
import { TableCollumn } from '../types/TableCollumn';
import { TableCrudOperations } from '../types/TableCrudOperations';
import { TableRow } from './TableRow';
import { TableThead } from './TableThead';

// Função auxiliar da busca
export const normalizeString = (str: string) => {
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
  collumns: TableCollumn<T>[];
  crudOperations?: TableCrudOperations<T>;
  search?: string;
  searched?: (data: T) => string;
  dataFilter?: (data: T) => boolean;
  ExpandedComponent?: (data: T) => ReactNode;
};

export function DataTable<T>(props: TableProps<T>) {
  const [sortedBy, setSortedBy] = useState<string | null>(null);
  const [sortedAscending, setSortedAscending] = useState<boolean | null>(null);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);

  const [expandedRow, setExpandedRow] = useState<number | null>(null);

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
    const sortByCollumn = props.collumns.find((collum) => collum.name === sortedBy) ?? null;
    const defaultSortingCollumn = props.collumns[0];

    const sortByOrder = sortByCollumn ? sortByCollumn.sorter!(a, b) : 0;
    const defaultOrder = defaultSortingCollumn.sorter ? defaultSortingCollumn.sorter(a, b) : 0;

    const absoluteOrder = sortByOrder === 0 ? defaultOrder : sortByOrder;
    return sortedAscending ? -absoluteOrder : absoluteOrder;
  });

  const actionsCollumnsNeeded =
    !!props.crudOperations?.handleBeginDataEdit || !!props.crudOperations?.handleDeleteData;

  // Se não há ações disponíveis, e não será gerada coluna de ações, todas as colunas são fixas
  const collumns = props.collumns.map((col) => {
    return { ...col, fixed: true };
  });

  return (
    <Paper radius="sm" withBorder style={{ overflow: 'hidden' }}>
      <Table tabularNums striped={expandedRow === null} highlightOnHover>
        <TableThead
          collumns={collumns}
          hiddenColunms={hiddenColumns}
          sortedAscending={sortedAscending}
          sortedBy={sortedBy}
          onHideCollumn={handleHideCollumn}
          onShowCollumn={handleShowCollumn}
          onToggleSorting={handleToggleSorting}
          actionsCollumnsNeeded={actionsCollumnsNeeded}
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
              <TableRow<T>
                key={index}
                data={data}
                hiddenColunms={hiddenColumns}
                collumns={props.collumns}
                crudOperations={props.crudOperations}
                actionsCollumnsNeeded={actionsCollumnsNeeded}
                isExpanded={expandedRow === index}
                onExpandRow={() => setExpandedRow(index === expandedRow ? null : index)}
                expandedComponent={
                  props.ExpandedComponent ? () => props.ExpandedComponent!(data) : undefined
                }
              />
            ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
