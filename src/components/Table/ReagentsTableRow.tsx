import { useState } from 'react';
import { Table } from '@mantine/core';
import Reagent from '@/src/typings/Reagent';
import formattedAmount from '@/src/utils/formattedAmount';
import formattedDate from '@/src/utils/formattedDate';
import ActionsRowButtons from './ActionsRowButtons';


type ReagentsTableRowProps = {
  reagent: Reagent;
  collumnsShown: Record<string, boolean>;
  handleDeleteReagent: () => void;
  beginReagentEdit: () => void;
  handleShowReagent: () => void;
};

export default function ReagentsTableRow({
  reagent,
  collumnsShown,
  handleDeleteReagent,
  beginReagentEdit,
  handleShowReagent,
}: ReagentsTableRowProps) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Table.Tr onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {collumnsShown['Reagente'] && <Table.Td>{reagent.name}</Table.Td>}
      {collumnsShown['Quantidade'] && <Table.Td>{formattedAmount(reagent)}</Table.Td>}
      {collumnsShown['Entrada'] && <Table.Td>{formattedDate(reagent.inDate)}</Table.Td>}
      {collumnsShown['Saída'] && <Table.Td>{formattedDate(reagent.outDate)}</Table.Td>}
      {collumnsShown['Vencimento'] && <Table.Td>{formattedDate(reagent.expireDate)}</Table.Td>}

      {collumnsShown['Reagente'] && (
        <Table.Td>
          <ActionsRowButtons
            ishovered={isHovered}
            handleDeleteReagent={handleDeleteReagent}
            beginReagentEdit={beginReagentEdit}
            handleShowReagent={handleShowReagent}
          />
        </Table.Td>
      )}
    </Table.Tr>
  );
}