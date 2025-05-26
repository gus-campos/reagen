import { useState } from 'react';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Table } from '@mantine/core';
import Reagent from '../typings/Reagent';

type ActionsButtonsProps = {
  ishovered: boolean;
  handleDeleteReagent: () => void;
  beginReagentEdit: () => void;
};

const ActionsButtons = ({
  ishovered,
  handleDeleteReagent,
  beginReagentEdit,
}: ActionsButtonsProps) => {
  return (
    <>
      <ActionIcon variant="transparent" opacity={ishovered ? 1 : 0} onClick={handleDeleteReagent}>
        <IconTrash />
      </ActionIcon>

      <ActionIcon variant="transparent" opacity={ishovered ? 1 : 0} onClick={beginReagentEdit}>
        <IconEdit />
      </ActionIcon>
    </>
  );
};

// =================================================================================================

type ReagentsTableRowProps = {
  reagent: Reagent;
  handleDeleteReagent: () => void;
  beginReagentEdit: () => void;
};

const ReagentsTableRow = ({
  reagent,
  handleDeleteReagent,
  beginReagentEdit,
}: ReagentsTableRowProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Table.Tr onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Table.Td>{reagent.name}</Table.Td>
      <Table.Td>{reagent.amount + ' ' + reagent.unit}</Table.Td>
      <Table.Td>
        <ActionsButtons
          ishovered={isHovered}
          handleDeleteReagent={handleDeleteReagent}
          beginReagentEdit={beginReagentEdit}
        />
      </Table.Td>
    </Table.Tr>
  );
};

// =================================================================================================

// Função auxiliar da busca
const normalizeString = (str: string) => {
  return str
    .trim()
    .normalize('NFD') // Normaliza para forma de decomposição canônica
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos (acentos)
    .toLowerCase(); // Converte para minúsculas
};

type ReagentsTableProps = {
  reagents: Reagent[];
  search: string;
  handleDeleteReagent: (reagent: Reagent) => void;
  beginReagentEdit: (editedReagent: Reagent) => void;
};

export default function ReagentsTable({
  reagents,
  search,
  handleDeleteReagent,
  beginReagentEdit,
}: ReagentsTableProps) {
  return (
    <Table tabularNums striped highlightOnHover withTableBorder>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Reagente</Table.Th>
          <Table.Th>Quantidade</Table.Th>
          <Table.Th>Ações</Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {reagents
          .filter((item) => normalizeString(item.name).includes(normalizeString(search)))
          .map((reagent, key) => (
            <ReagentsTableRow
              key={key}
              reagent={reagent}
              handleDeleteReagent={() => handleDeleteReagent(reagent)}
              beginReagentEdit={() => beginReagentEdit(reagent)}
            />
          ))}
      </Table.Tbody>
    </Table>
  );
}
