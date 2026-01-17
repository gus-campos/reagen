import { useEffect, useState } from 'react';
import { DataTableContextType } from '@/features/data-table/data-table.provider';
import { searchMatch } from '@/features/data-table/data-table.util';
import { TableProps } from '@/features/data-table/data-table.view';

export function useDataTable<T>(props: TableProps<T>) {
  const [sortedBy, setSortedBy] = useState<string | null>(null);
  const [sortedAscending, setSortedAscending] = useState<boolean | null>(null);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const dataFilter = props.dataFilter ?? ((_: T) => true);

  const isSearched = (data: T) =>
    props.searched && props.search ? searchMatch(props.searched(data), props.search) : () => true;

  const sorter = (a: T, b: T) => {
    if (props.sort) {
      const collumn = props.collumns.find((c) => c.name === props.sort?.colunmName);
      if (!collumn) throw new Error(`A coluna ${props.sort.colunmName} não existe`);
      const sorter = collumn.sorter;
      if (!sorter) throw new Error(`A coluna ${props.sort.colunmName} não possui ordenador`);
      return sorter(a, b);
    }
    // coluna escolhida para ordenação (pode não existir)
    const sortCol = props.collumns.find((c) => c.name === sortedBy) ?? null;
    // coluna padrão usada como critério de desempate
    const defaultCol = props.collumns[0];
    // tentativa de ordenação pela coluna escolhida
    const primary = sortCol?.sorter ? sortCol.sorter(a, b) : 0;
    // se a coluna escolhida decidir a ordem, usa esse resultado
    if (primary !== 0) return primary;
    // caso contrário, aplica o sorter da coluna padrão
    return defaultCol.sorter ? defaultCol.sorter(a, b) : 0;
  };

  const sortedDatas = props.datas.sort((a, b) => {
    const order = sorter(a, b);
    const fixedSoertedAscending = props.sort?.sortedAscending;
    const finalSortedAscending = fixedSoertedAscending ?? sortedAscending;
    return finalSortedAscending ? -order : order;
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
