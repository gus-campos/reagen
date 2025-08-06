import React, { useState } from 'react';
import { Paper, Table } from '@mantine/core';
import { CrudOperations, TableCollumn } from '@/src/view/TableView';
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
  initialCollumns: TableCollumn<T>[];
  crudOperations?: CrudOperations<T>;
  search?: string;
  searched?: (data: T) => string;
  dataFilter?: (data: T) => boolean;
  expandedComponent?: (data: T) => React.ReactNode;
};

export function DataTable<T>(props: TableProps<T>) {
  const [collumns, setCollumns] = useState<TableCollumn<T>[]>(props.initialCollumns);
  const [expandedDataIndex, setExpandedDataIndex] = useState(-1);

  const collumnsNames = collumns.map((collumn) => collumn.name);

  const setCollumnsVisibility = (collumnName: string, hidden: boolean) => {
    if (!collumnsNames.includes(collumnName)) throw new Error('Coluna inválida');

    setCollumns(
      collumns.map((collumn) => (collumn.name === collumnName ? { ...collumn, hidden } : collumn))
    );
  };

  const handleHideCollumn = (collumnName: string) => setCollumnsVisibility(collumnName, true);
  const handleShowCollumn = (collumnName: string) => setCollumnsVisibility(collumnName, false);

  const handleToggleSorting = (collumnName: string) => {
    if (!collumnsNames.includes(collumnName)) throw new Error('Coluna inválida');

    // ascending true -> ascending null
    // ascending null -> ascending false
    // ascending false -> ascending true

    const nextOdering = (collumn: TableCollumn<T>) => {
      return collumn.ascending != null ? (collumn.ascending ? null : true) : false;
    };

    const nextPriority = (collumn: TableCollumn<T>) => {
      if (collumn.ascending !== null) {
        // Deixou de ordenar - remover prioridade
        if (collumn.ascending) return null;
        // Mudou a ordem - manter prioridade
        else return collumn.sortingPriority;
      }

      // Começou a ordenar - colocar em último
      else {
        const max = Math.max(...collumns.map((collumn) => collumn.sortingPriority ?? -1));
        return max + 1;
      }
    };

    setCollumns(
      collumns.map((collumn) =>
        collumn.name === collumnName
          ? {
              ...collumn,
              ascending: nextOdering(collumn),
              sortingPriority: nextPriority(collumn),
            }
          : collumn
      )
    );
  };

  const sortedDatas = [...props.datas].sort((a, b) => {
    const sortingCollumns = [...collumns]
      .filter((collum) => collum.ascending !== null)
      .sort((a, b) => (a.sortingPriority ?? Infinity) - (b.sortingPriority ?? Infinity));

    for (const sortingCollumn of sortingCollumns) {
      const result = sortingCollumn.sorter ? sortingCollumn.sorter(a, b) : 0;
      if (result !== 0) return sortingCollumn.ascending ? -result : result;
    }
    return -1;
  });

  const handleClickRow = (index: number) => {
    setExpandedDataIndex(index !== expandedDataIndex ? index : -1);
  };

  return (
    <Paper radius="md" withBorder style={{ overflow: 'hidden' }}>
      <Table tabularNums striped highlightOnHover>
        <TableThead
          collumns={collumns}
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
              <React.Fragment key={index}>
                <TableRow
                  data={data}
                  collumns={collumns}
                  crudOperations={props.crudOperations}
                  handleClick={() => handleClickRow(index)}
                  clickable={!!props.expandedComponent}
                />
                {index === expandedDataIndex && props.expandedComponent && (
                  <Table.Tr>
                    <Table.Td colSpan={collumns.length + 1}>
                      {props.expandedComponent(data)}
                    </Table.Td>
                  </Table.Tr>
                )}
              </React.Fragment>
            ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
