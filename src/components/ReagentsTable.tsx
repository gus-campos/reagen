import { useState } from 'react';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Table } from '@mantine/core';
import ReagentData from '../typings/ReagentData';

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

type ReagentsTableRowProps = {
  reagentData: ReagentData;
  handleDeleteReagent: () => void;
  beginReagentEdit: () => void;
};

const ReagentsTableRow = ({
  reagentData,
  handleDeleteReagent,
  beginReagentEdit,
}: ReagentsTableRowProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Table.Tr onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Table.Td>{reagentData.name}</Table.Td>
      <Table.Td>{reagentData.amount + ' ' + reagentData.unit}</Table.Td>

      {/* 
      <Table.Td>{reagentData.amount}</Table.Td>
      <Table.Td>{reagentData.unit}</Table.Td>
      */}

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

type ReagentsTableProps = {
  reagententsData: ReagentData[];
  search: string;
  handleDeleteReagent: (key: number) => void;
  beginReagentEdit: (editedReagent: ReagentData) => void;
};

function normalizeString(str: string): string {
  return str
    .trim()
    .normalize('NFD') // Normaliza para forma de decomposição canônica
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos (acentos)
    .toLowerCase(); // Converte para minúsculas
}

export default function ReagentsTable({
  reagententsData,
  search,
  handleDeleteReagent,
  beginReagentEdit,
}: ReagentsTableProps) {
  return (
    <Table tabularNums striped highlightOnHover withTableBorder>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Reagentente</Table.Th>
          <Table.Th>Quantidade</Table.Th>
          {/* <Table.Th>Unidade</Table.Th> */}
          <Table.Th>Ações</Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {reagententsData
          .filter((item) => normalizeString(item.name).includes(normalizeString(search)))
          .map((reagent, key) => (
            <ReagentsTableRow
              key={key}
              reagentData={reagent}
              handleDeleteReagent={() => handleDeleteReagent(reagent.id!)} // FIXME: Essa garantia é inadequada?
              beginReagentEdit={() => beginReagentEdit(reagent)}
            />
          ))}
      </Table.Tbody>
    </Table>
  );
}
