import { Group, Table, Text } from '@mantine/core';
import { TableCollumn } from '@/src/components/Crud/Table/TableView';
import { ActionsCollumnButtons } from './ActionsCollumnButtons';
import { TableExtraOptions } from './TableExtraOptions';

type ItemsTableTheadProps<T> = {
  collumns: TableCollumn<T>[];
  sortedAscending: boolean | null;
  sortedBy: string | null;
  hiddenColunms: string[];
  onHideCollumn: (collumnName: string) => void;
  onShowCollumn: (collumnName: string) => void;
  onToggleSorting: (collumnName: string) => void;
};

export function TableThead<T>(props: ItemsTableTheadProps<T>) {
  return (
    <Table.Thead>
      <Table.Tr>
        {props.collumns
          .filter((column) => !props.hiddenColunms.includes(column.name))
          .map((collumn, index) => (
            <Table.Th key={index}>
              <Group gap="5px" justify="flex-start">
                <Text size="md" fw="bold">
                  {collumn.name}
                </Text>
                <ActionsCollumnButtons
                  fixed={collumn.fixed !== null ? !!collumn.fixed : true}
                  sortable={!!collumn.sorter}
                  ascending={
                    props.sortedBy === collumn.name ? (props.sortedAscending ? true : false) : null
                  }
                  onHandleHideCollumn={() => props.onHideCollumn(collumn.name)}
                  onToggleSorting={() => props.onToggleSorting(collumn.name)}
                />
              </Group>
            </Table.Th>
          ))}
        <Table.Th>
          <Group gap="5px" justify="center">
            <Text fw="bold">Ações</Text>
            <TableExtraOptions
              collumns={props.collumns}
              hiddenColunms={props.hiddenColunms}
              onShowCollumn={props.onShowCollumn}
            />
          </Group>
        </Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
}
