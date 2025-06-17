import { useState } from 'react';
import { Paper, Table } from '@mantine/core';
import { ReagentsFilter } from '@/src/typings/reagents-filter';
import { filteredReagent } from '@/src/utils/filtered-reagent';
import { Reagent } from '../../typings/reagent';
import { ReagentsTableRow } from './ReagentsTableRow';
import { ReagentsTableThead } from './ReagentsTableThead';

// Função auxiliar da busca
const normalizeString = (str: string) => {
  return str
    .trim()
    .normalize('NFD') // Normaliza para forma de decomposição canônica
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos (acentos)
    .toLowerCase(); // Converte para minúsculas
};

const searchMatch = (serched: string, searchTerm: string) => {
  return normalizeString(serched).includes(normalizeString(searchTerm));
};

const collumnsNames = ['Reagente', 'Quantidade', 'Entrada', 'Saída', 'Vencimento', 'Ações'];
const fixedCollumns = ['Reagente', 'Ações'];
const collumnsShownDefault: Record<string, boolean> = {};
for (const collumn of collumnsNames) collumnsShownDefault[collumn] = true;

type ReagentsTableProps = {
  reagents: Reagent[];
  search: string;
  filter: ReagentsFilter;
};

export function ReagentsTable({ reagents, search, filter }: ReagentsTableProps) {
  const [collumnsShown, setCollumnsShown] = useState<Record<string, boolean>>(collumnsShownDefault);
  const [sortedByColumn, setSortedByColumn] = useState<string | null>(fixedCollumns[0]);
  const [sortedAscending, setSortedAscending] = useState(true);

  const setCollumnsVisibility = (collumnName: string, visible: boolean) => {
    if (!collumnsNames.includes(collumnName)) throw new Error('Coluna inválida');
    setCollumnsShown({ ...collumnsShown, [collumnName]: visible });
  };

  const handleHideCollumn = (collumnName: string) => setCollumnsVisibility(collumnName, false);
  const handleShowCollumn = (collumnName: string) => setCollumnsVisibility(collumnName, true);

  const handleSortingSelection = (sortedByColumn: string | null, ascending: boolean = true) => {
    setSortedByColumn(sortedByColumn);
    setSortedAscending(ascending);
  };

  const sortReagents = (reagentA: Reagent, reagentB: Reagent) => {
    return 1;
  };

  return (
    <Paper radius="md" withBorder style={{ overflow: 'hidden' }}>
      <Table tabularNums striped highlightOnHover>
        <ReagentsTableThead
          fixedCollumns={fixedCollumns}
          collumnsShown={collumnsShown}
          onHideCollumn={handleHideCollumn}
        />

        <Table.Tbody>
          {reagents
            .filter((reagent) => searchMatch(reagent.name, search))
            .filter((reagent) => filteredReagent(reagent, filter))
            .toSorted((reagentA, reagentB) => sortReagents(reagentA, reagentB))
            .map((reagent, key) => (
              <ReagentsTableRow
                key={key}
                reagent={reagent}
                collumnsShown={collumnsShown}
                sortedByColumn={sortedByColumn}
                sortedAscending={sortedAscending}
                onSortingSelection={handleSortingSelection}
              />
            ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
