import { useState } from 'react';
import { Accordion, Table } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { CrudOperations, TableCollumn } from '@/src/components/Crud/Table/TableView';
import { ActionsRowButtons } from './ActionsRowButtons';

type TableRowProps<T> = {
  data: T;
  collumns: TableCollumn<T>[];
  crudOperations?: CrudOperations<T>;
  handleClick?: () => void;
  clickable: boolean;
};

export function TableRow<T>(props: TableRowProps<T>) {
  const { hovered, ref } = useHover();

  return (
    <Table.Tr ref={ref}>
      {props.collumns
        .filter((collumn) => !collumn.hidden)
        .map((collumn, index) => (
          <Table.Td
            key={index}
            onClick={props.handleClick}
            style={{ cursor: props.clickable ? 'pointer' : 'unset' }}
          >
            {collumn.accessor(props.data)}
          </Table.Td>
        ))}
      <Table.Td>
        <ActionsRowButtons
          ishovered={hovered}
          data={props.data}
          crudOperations={props.crudOperations}
        />
      </Table.Td>
    </Table.Tr>
  );
}
