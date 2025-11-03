import { ReactNode } from 'react';
import { Box, Group, Table } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { TableCollumn } from '../types/TableCollumn';
import { TableCrudOperations } from '../types/TableCrudOperations';
import { ActionsRowButtons } from './ActionsRowButtons';
import { DataTable } from './DataTable';

type TableRowProps<T> = {
  data: T;
  hiddenColunms: string[];
  collumns: TableCollumn<T>[];
  crudOperations?: TableCrudOperations<T>;
  actionsCollumnsNeeded: boolean;
  isExpanded: boolean;
  onExpandRow?: () => void;
  expandedComponent?: () => ReactNode;
};

export function TableRow<T>(props: TableRowProps<T>) {
  const { hovered, ref } = useHover();

  const handleClick = props.crudOperations?.handleClickRow
    ? () => props.crudOperations!.handleClickRow!(props.data)
    : undefined;

  const visibleCollumns = props.collumns.filter(
    (collumn) => !props.hiddenColunms.includes(collumn.name)
  );

  const totalCollumns = visibleCollumns.length + (props.actionsCollumnsNeeded ? 1 : 0);

  // const totalCollumns =

  return (
    <>
      <Table.Tr ref={ref}>
        {visibleCollumns.map((collumn, index) => (
          <Table.Td
            key={index}
            onClick={props.expandedComponent ? props.onExpandRow : handleClick}
            style={{
              cursor: handleClick ? 'pointer' : 'unset',
            }}
          >
            {collumn.accessor(props.data)}
          </Table.Td>
        ))}
        {props.actionsCollumnsNeeded && (
          <Table.Td>
            <ActionsRowButtons
              ishovered={hovered}
              data={props.data}
              crudOperations={props.crudOperations}
            />
          </Table.Td>
        )}
      </Table.Tr>
      {props.isExpanded && props.expandedComponent && (
        <Table.Tr>
          <Table.Td colSpan={totalCollumns} style={{ padding: 0 }}>
            <Box>
              <props.expandedComponent />
            </Box>
          </Table.Td>
        </Table.Tr>
      )}
    </>
  );
}
