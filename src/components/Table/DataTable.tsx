import { useState } from 'react';
import { Paper, Table } from '@mantine/core';
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

export type CrudOperations<T> = {
  handleDeleteData: (data: T) => void;
  handleBeginDataEdit: (data: T) => void;
  handleShowData: (data: T) => void;
  sortData: (a: T, b: T) => number;
};

export type TableCollumn<T> = {
  accessor: (data: T) => string;
  name: string;
  fixed: boolean;
  hidden: boolean;
};

type TableProps<T> = {
  datas: T[];
  initialCollumns: TableCollumn<T>[];
  search: string;
  crudOperations: CrudOperations<T>;
  // filter: DataFilter<T>;
};

export function DataTable<T>({ datas, initialCollumns, search, crudOperations }: TableProps<T>) {
  const [collumns, setCollumns] = useState<TableCollumn<T>[]>(initialCollumns);

  const collumnsNames = collumns.map((collumn) => collumn.name);

  const setCollumnsVisibility = (name: string, hidden: boolean) => {
    if (!collumnsNames.includes(name)) throw new Error('Coluna inválida');

    setCollumns(
      collumns.map((collumn) => (collumn.name == name ? { ...collumn, hidden } : collumn))
    );
  };

  const handleHideCollumn = (collumnName: string) => setCollumnsVisibility(collumnName, true);
  const handleShowCollumn = (collumnName: string) => setCollumnsVisibility(collumnName, false);

  const handleSortingSelection = (sortedByColumn: string | null, ascending: boolean = true) => {
    // setSortedByColumn(sortedByColumn);
    // setSortedAscending(ascending);
  };

  // const sortReagents = (reagentA: Reagent, reagentB: Reagent) => {
  //   return 1;
  // };

  return (
    <Paper radius="md" withBorder style={{ overflow: 'hidden' }}>
      <Table tabularNums striped highlightOnHover>
        <TableThead collumns={collumns} onHideCollumn={handleHideCollumn} />

        <Table.Tbody>
          {datas
            // .filter((data) => searchMatch(data.name, search))
            // .filter((data) => filteredReagent(data, filter))
            // .toSorted((a, b) => sortReagents(a, b))
            .map((data, key) => (
              <TableRow
                key={key}
                data={data}
                collumns={collumns}
                crudOperations={crudOperations}
                // onSortingSelection={handleSortingSelection}
                // sortedByColumn={sortedByColumn}
                // sortedAscending={sortedAscending}
              />
            ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
