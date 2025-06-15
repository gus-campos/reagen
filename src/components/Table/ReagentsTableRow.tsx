import { useState } from 'react';
import { Table } from '@mantine/core';
import Reagent from '@/src/typings/Reagent';
import formattedAmount from '@/src/utils/formattedAmount';
import formattedDate from '@/src/utils/formattedDate';
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
      <Table.Td>{formattedAmount(reagent)}</Table.Td>
      <Table.Td>{formattedDate(reagent.inDate)}</Table.Td>
      <Table.Td>{formattedDate(reagent.outDate)}</Table.Td>
      <Table.Td>{formattedDate(reagent.expireDate)}</Table.Td>
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
