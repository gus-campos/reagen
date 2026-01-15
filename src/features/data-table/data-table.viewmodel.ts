import { ReactNode, useEffect, useState } from 'react';
import { DataTableContextType } from '@/features/data-table/data-table.provider';
import { TableCollumn, TableCrudOperations } from '@/features/data-table/data-table.type';
import { searchMatch } from '@/features/data-table/data-table.util';

type CrudAction<T> = {
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

export function useDataTable<T>(props: TableProps<T>) {
  const [sortedBy, setSortedBy] = useState<string | null>(null);
  const [sortedAscending, setSortedAscending] = useState<boolean | null>(null);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const dataFilter = props.dataFilter ?? ((_: T) => true);

  const isSearched = (data: T) =>
    props.searched && props.search ? searchMatch(props.searched(data), props.search) : () => true;

  const sortedDatas = props.datas.sort((a, b) => {
    const sortByCollumn = props.collumns.find((collum) => collum.name === sortedBy) ?? null;
    const defaultSortingCollumn = props.collumns[0];

    const sortByOrder = sortByCollumn ? sortByCollumn.sorter!(a, b) : 0;
    const defaultOrder = defaultSortingCollumn.sorter ? defaultSortingCollumn.sorter(a, b) : 0;

    const absoluteOrder = sortByOrder === 0 ? defaultOrder : sortByOrder;
    return sortedAscending ? -absoluteOrder : absoluteOrder;
  });

  const actionsCollumnsNeeded =
    [props.crudOperations?.handleBeginDataEdit, props.crudOperations?.handleDeleteData].some(
      (action) => !!action
    ) || (props.extraActions?.length ?? 0) > 0;

  const collumns = actionsCollumnsNeeded
    ? props.collumns
    : props.collumns.map((col) => {
        return { ...col, fixed: true };
      });

  const shouldBeStriped = !props.getExpandedComponent || expandedRow === null;
  const isCollumnExpanded = (index: number) => expandedRow === index;

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
      case null:
        newSortedAscending = false;
        break;
      case false:
        newSortedAscending = true;
        break;
      case true:
        newSortedAscending = null;
    }

    const newSortedBy = newSortedAscending === null ? null : collumnName;

    setSortedAscending(newSortedAscending);
    setSortedBy(newSortedBy);
  };

  const handleExpandRow = (index: number) => {
    const isRowExpanded = index === expandedRow;
    const newExpandedRow = isRowExpanded ? null : index;

    if (props.crudOperations?.onChangeExpandedData) {
      const expandedData = newExpandedRow !== null ? props.datas[newExpandedRow] : null;
      props.crudOperations.onChangeExpandedData(expandedData);
    }
    setExpandedRow(newExpandedRow);
  };

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

  useEffect(() => {
    setExpandedRow(null);
    if (props.crudOperations?.onChangeExpandedData) {
      props.crudOperations.onChangeExpandedData(null);
    }
  }, [props.datas]);

  return {
    sortedAscending,
    sortedBy,
    hiddenColumns,
    expandedRow,
    sortedDatas,
    shouldBeStriped,
    isCollumnExpanded,
    dataTableContextValues,
    handleExpandRow,
    isSearched,
    dataFilter,
  };
}
