import { Box, Table } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import {
  DataTableRealContextType,
  useDataTableContext,
} from '@/features/data-table/data-table.provider';
import { ActionsRowButtons } from '@/features/data-table/views/actions-row-buttons.view';

type TableRowProps<T> = {
  data: T;
  isExpanded: boolean;
  onExpandRow?: () => void;
};

export function TableRow<T>(props: TableRowProps<T>) {
  const { collumns, hiddenCollumns, crudOperations, actionsCollumnNeeded, getExpandedComponent } =
    useDataTableContext() as DataTableRealContextType<T>;

  const { hovered, ref } = useHover();

  const defaultHandleClick = crudOperations?.handleClickRow
    ? () => crudOperations!.handleClickRow!(props.data)
    : undefined;

  const handleClick = getExpandedComponent ? props.onExpandRow : defaultHandleClick;

  const visibleCollumns = collumns.filter((collumn) => !hiddenCollumns.includes(collumn.name));

  const totalCollumns = visibleCollumns.length + (actionsCollumnNeeded ? 1 : 0);

  return (
    <>
      <Table.Tr ref={ref}>
        {visibleCollumns.map((collumn, index) => (
          <Table.Td
            key={index}
            onClick={handleClick}
            style={{
              cursor: handleClick ? 'pointer' : 'unset',
            }}
          >
            {collumn.accessor(props.data)}
          </Table.Td>
        ))}
        {actionsCollumnNeeded && (
          <Table.Td>
            <ActionsRowButtons ishovered={hovered} data={props.data} />
          </Table.Td>
        )}
      </Table.Tr>
      {getExpandedComponent && props.isExpanded && (
        <Table.Tr>
          <Table.Td colSpan={totalCollumns} style={{ padding: 0 }}>
            <Box>{getExpandedComponent(props.data)}</Box>
          </Table.Td>
        </Table.Tr>
      )}
    </>
  );
}
