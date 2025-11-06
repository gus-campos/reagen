import React, { ReactNode, useEffect, useState } from 'react';
import { Paper, Table } from '@mantine/core';
import { DataTableContext, DataTableContextType } from '../providers/DataTableContext';
import { TableCollumn } from '../types/TableCollumn';
import { TableCrudOperations } from '../types/TableCrudOperations';
import { searchMatch } from '../utils/search';
import { TableRow } from './TableRow';
import { TableThead } from './TableThead';

type TableProps<T> = {
  datas: T[];
  collumns: TableCollumn<T>[];
  crudOperations?: TableCrudOperations<T>;
  search?: string;
  searched?: (data: T) => string;
  dataFilter?: (data: T) => boolean;
  getExpandedComponent?: (data: T) => ReactNode;
  smallHeading?: boolean;
};

// FIXME: Está enorme. Pode ser melhorado.

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

  // Só é necessário haver coluna de ação se houver algum handle de ação definido

  // Se não há ações disponíveis, e pontanto não será gerada coluna de ações,
  // todas as colunas devem ser fixas
  const collumns = props.collumns.map((col) => {
    return { ...col, fixed: true };
  });

  // As colunas devem ter padrão de listra somente quando não houver sub tabela expandida
  const shouldBeStriped = !props.getExpandedComponent || expandedRow === null;

  const dataFilter = props.dataFilter ?? ((_: T) => true);

  const isSearched = (data: T) =>
    props.searched && props.search ? searchMatch(props.searched(data), props.search) : () => true;

  const handleExpandRow = (index: number) => {
    const isRowExpanded = index === expandedRow;
    const newExpandedRow = isRowExpanded ? null : index;

    if (props.crudOperations?.onChangeExpandedData) {
      const expandedData = newExpandedRow !== null ? props.datas[newExpandedRow] : null;
      props.crudOperations.onChangeExpandedData(expandedData);
    }
    setExpandedRow(newExpandedRow);
  };

  const isCollumnExpanded = (index: number) => expandedRow === index;

  useEffect(() => {
    setExpandedRow(null);
    if (props.crudOperations?.onChangeExpandedData) {
      props.crudOperations.onChangeExpandedData(null);
    }
  }, [props.datas]);

  const actionsCollumnsNeeded = [
    props.crudOperations?.handleBeginDataEdit,
    props.crudOperations?.handleDeleteData,
  ].some((action) => !!action);

  // Valores pro provider
  const dataTableContextValues: DataTableContextType = {
    collumns: props.collumns,
    hiddenCollumns: hiddenColumns,
    crudOperations: props.crudOperations,
    onHideCollumn: handleHideCollumn,
    onShowCollumn: handleShowCollumn,
    onToggleSorting: handleToggleSorting,
    getExpandedComponent: props.getExpandedComponent,
    actionsCollumnNeeded: actionsCollumnsNeeded,
  } as DataTableContextType;

  return (
    <DataTableContext.Provider value={dataTableContextValues}>
      <Paper radius="sm" withBorder style={{ overflow: 'hidden' }}>
        <Table tabularNums striped={shouldBeStriped} highlightOnHover>
          <TableThead
            sortedAscending={sortedAscending}
            sortedBy={sortedBy}
            smallHeding={props.smallHeading}
          />

          <Table.Tbody>
            {sortedDatas
              .filter((data) => isSearched(data))
              .filter((data) => dataFilter(data))
              .map((data, index) => (
                <TableRow<T>
                  key={index}
                  data={data}
                  isExpanded={isCollumnExpanded(index)}
                  onExpandRow={() => handleExpandRow(index)}
                />
              ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </DataTableContext.Provider>
  );
}
