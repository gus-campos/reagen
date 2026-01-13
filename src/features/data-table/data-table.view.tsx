import React, { ReactNode, useEffect, useState } from 'react';
import { Paper, Table } from '@mantine/core';
import { DataTableContext, DataTableContextType } from './data-table.provider';
import { TableCollumn, TableCrudOperations } from './data-table.type';
import { searchMatch } from './data-table.util';
import { TableRow } from './views/TableRow';
import { TableThead } from './views/TableThead';

export type CrudAction<T> = {
  icon: ReactNode;
  action: (data: T) => void;
};

type TableProps<T> = {
  datas: T[];
  collumns: TableCollumn<T>[];
  crudOperations?: TableCrudOperations<T>;
  search?: string;
  searched?: (data: T) => string;
  dataFilter?: (data: T) => boolean;
  getExpandedComponent?: (data: T) => ReactNode;
  smallHeading?: boolean;
  extraActions?: CrudAction<T>[];
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
    let newSortedAscending;
    switch (sortedAscending) {
      // Se não está ordenado, passar para descending
      case null:
        newSortedAscending = false;
        break;
      // Se está descending, passar pra ascending
      case false:
        newSortedAscending = true;
        break;
      // Se está ascending, passar para não ordenado
      case true:
        newSortedAscending = null;
    }

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

  // Só é necessário haver coluna de ação se houver algum handle de ação definido
  // Ou se foi passada alguma ação extra
  const actionsCollumnsNeeded =
    [props.crudOperations?.handleBeginDataEdit, props.crudOperations?.handleDeleteData].some(
      (action) => !!action
    ) || (props.extraActions?.length ?? 0) > 0;

  // Se não há ações disponíveis, e pontanto não será gerada coluna de ações,
  // todas as colunas devem ser fixas
  const collumns = actionsCollumnsNeeded
    ? props.collumns
    : props.collumns.map((col) => {
        return { ...col, fixed: true };
      });

  // TODO: Olha mostra como se todas colunas tivessem ocultas, e não consegue desocultar

  // Valores pro provider
  const dataTableContextValues: DataTableContextType = {
    collumns,
    hiddenCollumns: hiddenColumns,
    crudOperations: props.crudOperations,
    onHideCollumn: handleHideCollumn,
    onShowCollumn: handleShowCollumn,
    onToggleSorting: handleToggleSorting,
    getExpandedComponent: props.getExpandedComponent,
    actionsCollumnNeeded: actionsCollumnsNeeded,
    extraActions: props.extraActions,
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
