import { Group, Table, Text } from '@mantine/core';
import { ActionsCollumnButtons } from '@/features/data-table/components/actions-collumn-buttons.view';
import { TableExtraOptions } from '@/features/data-table/components/table-extra-options.view';
import {
  DataTableRealContextType,
  useDataTableContext,
} from '@/features/data-table/data-table.provider';
import { TableCollumn } from '@/features/data-table/data-table.type';

type VialsTableTheadProps = {
  sortedAscending: boolean | null;
  sortedBy: string | null;
  smallHeding?: boolean;
};

export function TableThead<T>(props: VialsTableTheadProps) {
  const {
    collumns,
    hiddenCollumns,
    actionsCollumnNeeded,
    onHideCollumn,
    onToggleSorting,
    onShowCollumn,
  } = useDataTableContext() as DataTableRealContextType<T>;

  const fontSize = props.smallHeding ? 'sm' : 'md';

  const isColumnFixed = (collumn: TableCollumn<T>) => collumn?.fixed ?? true;

  const ascending = (collumn: TableCollumn<T>) =>
    props.sortedBy === collumn.name ? !!props.sortedAscending : null;

  return (
    <Table.Thead>
      <Table.Tr>
        {collumns
          .filter((column) => !hiddenCollumns.includes(column.name))
          .map((collumn, index) => (
            <Table.Th key={index}>
              <Group gap="5px" justify="flex-start">
                <Text size={fontSize} fw="bold">
                  {collumn.name}
                </Text>
                <ActionsCollumnButtons
                  fixed={isColumnFixed(collumn)}
                  sortable={!!collumn.sorter}
                  ascending={ascending(collumn)}
                  onHandleHideCollumn={() => onHideCollumn(collumn.name)}
                  onToggleSorting={() => onToggleSorting(collumn.name)}
                />
              </Group>
            </Table.Th>
          ))}
        {actionsCollumnNeeded && (
          <Table.Th>
            <Group gap="5px" justify="center">
              <Text size={fontSize} fw="bold">
                Ações
              </Text>
              <TableExtraOptions
                collumns={collumns}
                hiddenColunms={hiddenCollumns}
                onShowCollumn={onShowCollumn}
              />
            </Group>
          </Table.Th>
        )}
      </Table.Tr>
    </Table.Thead>
  );
}
