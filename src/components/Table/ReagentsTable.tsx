import { useState } from 'react';
import { IconEye } from '@tabler/icons-react';
import { Paper, Table } from '@mantine/core';
import ReagentsFilter from '@/src/typings/ReagentsFilter';
import filteredReagent from '@/src/utils/filteredReagent';
import Reagent from '../../typings/Reagent';
import ActionsCollumnButtons from './ActionsCollumnButtons';
import ActionsRowButtons from './ActionsRowButtons';
import ReagentsTableRow from './ReagentsTableRow';

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
  handleDeleteReagent: (reagent: Reagent) => void;
  beginReagentEdit: (reagent: Reagent) => void;
  handleShowReagent: (reagent: Reagent) => void;
};

export default function ReagentsTable({
  reagents,
  search,
  filter,
  handleDeleteReagent,
  beginReagentEdit,
  handleShowReagent,
}: ReagentsTableProps) {
  const [collumnsShown, setCollumnsShown] = useState<Record<string, boolean>>(collumnsShownDefault);
  const [collumnsHovered, setCollumnsHovered] = useState(collumnsNames.map(() => false));

  const setCollumnsVisibility = (collumnName: string, visible: boolean) => {
    if (!collumnsNames.includes(collumnName)) throw new Error('Coluna inválida');
    setCollumnsShown({ ...collumnsShown, [collumnName]: visible });
  };

  const hideCollumn = (collumnName: string) => setCollumnsVisibility(collumnName, false);
  const showCollumn = (collumnName: string) => setCollumnsVisibility(collumnName, true);

  return (
    <Paper radius="md" withBorder style={{ overflow: 'hidden' }}>
      <Table tabularNums striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            {/* Depois, adicionar forma de reexibir colunas ocultas */}
            {Object.keys(collumnsShown)
              .filter((collumnsName) => collumnsShown[collumnsName])
              .map((collumnName, index) => (
                // TODO: Transformar em componente
                <Table.Th
                  key={index}
                  onMouseEnter={() =>
                    setCollumnsHovered(
                      collumnsHovered.map((_, indexHovered) => indexHovered == index)
                    )
                  }
                  onMouseLeave={() => setCollumnsHovered(collumnsHovered.map(() => false))}
                >
                  {collumnName}
                  {!fixedCollumns.includes(collumnName) && (
                    <ActionsCollumnButtons
                      ishovered={collumnsHovered[index]}
                      handleHideCollumn={() => hideCollumn(collumnName)}
                    />
                  )}
                </Table.Th>
              ))}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {reagents
            .filter((reagent) => searchMatch(reagent.name, search))
            .filter((reagent) => filteredReagent(reagent, filter))
            .map((reagent, key) => (
              <ReagentsTableRow
                key={key}
                reagent={reagent}
                collumnsShown={collumnsShown}
                handleDeleteReagent={() => handleDeleteReagent(reagent)}
                beginReagentEdit={() => beginReagentEdit(reagent)}
                handleShowReagent={() => handleShowReagent(reagent)}
              />
            ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
