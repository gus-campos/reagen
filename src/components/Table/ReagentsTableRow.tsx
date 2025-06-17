import { useState } from 'react';
import { Table } from '@mantine/core';
import { Reagent } from '@/src/typings/reagent';
import { formattedAmount } from '@/src/utils/formatted-amount';
import { formattedDate } from '@/src/utils/formatted-date';
import { ActionsRowButtons } from './ActionsRowButtons';

type ReagentsTableRowProps = {
  reagent: Reagent;
  collumnsShown: Record<string, boolean>;
  sortedByColumn: string | null;
  sortedAscending: boolean;
  onSortingSelection: (sortedByColumn: string, sortedAscending: boolean) => void;
};

export function ReagentsTableRow({ reagent, collumnsShown }: ReagentsTableRowProps) {
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
          <ActionsRowButtons ishovered={isHovered} reagent={reagent} />
        </Table.Td>
      )}
    </Table.Tr>
  );
}
