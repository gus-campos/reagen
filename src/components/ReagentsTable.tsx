import { useState } from 'react';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Table } from '@mantine/core';
import ReagentData from '../typings/ReagentData';

type ActionsButtonsProps = {
  ishovered: boolean;
  handleDelete: () => void;
};

const ActionsButtons = ({ ishovered, handleDelete }: ActionsButtonsProps) => {
  return (
    <>
      <ActionIcon variant="transparent" opacity={ishovered ? 1 : 0} onClick={handleDelete}>
        <IconTrash />
      </ActionIcon>

      <ActionIcon variant="transparent" opacity={ishovered ? 1 : 0}>
        <IconEdit />
      </ActionIcon>
    </>
  );
};

type ReagentsTableRowProps = {
  reagentData: ReagentData;
  handleDelete: () => void;
};

const ReagentsTableRow = ({ reagentData, handleDelete }: ReagentsTableRowProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Table.Tr onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Table.Td>{reagentData.name}</Table.Td>
      <Table.Td>{reagentData.amount}</Table.Td>
      <Table.Td>{reagentData.unit}</Table.Td>

      <Table.Td>
        <ActionsButtons ishovered={isHovered} handleDelete={handleDelete} />
      </Table.Td>
    </Table.Tr>
  );
};

type ReagentsTableProps = {
  reagententsData: ReagentData[];
  search: string;
  handleDelete: (key: number) => void;
};

export default function ReagentsTable({
  reagententsData,
  search,
  handleDelete,
}: ReagentsTableProps) {
  return (
    <Table tabularNums striped highlightOnHover withTableBorder>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Reagentente</Table.Th>
          <Table.Th>Quantidade</Table.Th>
          <Table.Th>Unidade</Table.Th>
          <Table.Th>Ações</Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {reagententsData
          .filter((item) => item.name.includes(search.trim()))
          .map((reagent, key) => (
            <ReagentsTableRow
              key={key}
              reagentData={reagent}
              handleDelete={() => handleDelete(reagent.id!)}
            />
          ))}
      </Table.Tbody>
    </Table>
  );
}
