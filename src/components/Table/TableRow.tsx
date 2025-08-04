import { useState } from 'react';
import { Table } from '@mantine/core';
import { formattedAmount } from '@/src/utils/formatted-amount';
import { formattedDate } from '@/src/utils/formatted-date';
import { ActionsRowButtons } from './ActionsRowButtons';
import { CrudOperations, TableCollumn } from './DataTable';

type TableRowProps<T> = {
  data: T;
  collumns: TableCollumn<T>[];
  crudOperations: CrudOperations<T>;
  // sortedByColumn: string | null;
  // sortedAscending: boolean;
  // onSortingSelection: (sortedByColumn: string, sortedAscending: boolean) => void;
};

export function TableRow<T>({ data, collumns, crudOperations }: TableRowProps<T>) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Table.Tr onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {collumns
        .filter((collumn) => !collumn.hidden)
        .map((collumn, index) => (
          <Table.Td key={index}>{collumn.accessor(data)}</Table.Td>
        ))}
      <Table.Td>
        <ActionsRowButtons ishovered={isHovered} data={data} crudOperations={crudOperations} />
      </Table.Td>
    </Table.Tr>
  );
}
