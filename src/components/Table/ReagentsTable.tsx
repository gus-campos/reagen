import { Paper, Table } from '@mantine/core';
import Reagent from '../../typings/Reagent';
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

type ReagentsTableProps = {
  reagents: Reagent[];
  search: string;
  handleDeleteReagent: (reagent: Reagent) => void;
  beginReagentEdit: (reagent: Reagent) => void;
  handleShowReagent: (reagent: Reagent) => void;
};

export default function ReagentsTable({
  reagents,
  search,
  handleDeleteReagent,
  beginReagentEdit,
  handleShowReagent,
}: ReagentsTableProps) {
  return (
    <Paper radius="md" withBorder style={{ overflow: 'hidden' }}>
      <Table tabularNums striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Reagente</Table.Th>
            <Table.Th>Quantidade</Table.Th>
            <Table.Th>Ações</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {reagents
            .filter((item) => searchMatch(item.name, search))
            .map((reagent, key) => (
              <ReagentsTableRow
                key={key}
                reagent={reagent}
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
