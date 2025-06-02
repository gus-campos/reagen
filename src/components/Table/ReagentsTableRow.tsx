import { useState } from 'react';
import { Table } from '@mantine/core';
import Reagent from '@/src/typings/Reagent';
import ActionsButtons from './ActionsButtons';

type ReagentsTableRowProps = {
  reagent: Reagent;
  handleDeleteReagent: () => void;
  beginReagentEdit: () => void;
  handleShowReagent: () => void;
};

export default function ReagentsTableRow({
  reagent,
  handleDeleteReagent,
  beginReagentEdit,
  handleShowReagent,
}: ReagentsTableRowProps) {
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
          handleShowReagent={handleShowReagent}
        />
      </Table.Td>
    </Table.Tr>
  );
}
