import { Table } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { CrudOperations, TableCollumn } from '@/src/components/Crud/Table/TableView';
import { ActionsRowButtons } from './ActionsRowButtons';

type TableRowProps<T> = {
  data: T;
  hiddenColunms: string[];
  collumns: TableCollumn<T>[];
  crudOperations?: CrudOperations<T>;
  handleClick?: () => void;
};

export function TableRow<T>(props: TableRowProps<T>) {
  const { hovered, ref } = useHover();

  return (
    <Table.Tr ref={ref}>
      {props.collumns
        .filter((collumn) => !props.hiddenColunms.includes(collumn.name))
        .map((collumn, index) => (
          <Table.Td
            key={index}
            onClick={props.handleClick}
            // FIXME: Limitar tamanho
            style={{
              cursor: props.handleClick ? 'pointer' : 'unset',
              // whiteSpace: 'nowrap',
              // overflow: 'hidden',
              // textOverflow: 'ellipsis',
              // maxWidth: 120,
            }}
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
