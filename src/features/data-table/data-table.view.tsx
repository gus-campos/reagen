import React, { ReactNode } from 'react';
import { Paper, Table } from '@mantine/core';
import { TableRow } from '@/features/data-table/components/table-row.view';
import { TableThead } from '@/features/data-table/components/table-thead.view';
import { DataTableContext } from '@/features/data-table/data-table.provider';
import { TableCollumn, TableCrudOperations } from '@/features/data-table/data-table.type';
import { useDataTable } from '@/features/data-table/data-table.viewmodel';

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

export function DataTable<T>(props: TableProps<T>) {
  const {
    sortedAscending,
    sortedBy,
    shouldBeStriped,
    sortedDatas,
    isCollumnExpanded,
    dataTableContextValues,
    handleExpandRow,
    isSearched,
    dataFilter,
  } = useDataTable(props);

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
