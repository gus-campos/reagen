import { useState } from 'react';
import { Table } from '@mantine/core';
import { CrudOperations, TableCollumn } from '@/src/view/TableView';
import { ActionsRowButtons } from './ActionsRowButtons';

type TableRowProps<T> = {
  data: T;
  collumns: TableCollumn<T>[];
  crudOperations?: CrudOperations<T>;
};

export function TableRow<T>(props: TableRowProps<T>) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Table.Tr onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {props.collumns
        .filter((collumn) => !collumn.hidden)
        .map((collumn, index) => (
          <Table.Td key={index}>{collumn.accessor(props.data)}</Table.Td>
        ))}
      <Table.Td>
        <ActionsRowButtons
          ishovered={isHovered}
          data={props.data}
          crudOperations={props.crudOperations}
        />
      </Table.Td>
    </Table.Tr>
  );
}
