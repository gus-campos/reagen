import { useState } from 'react';
import { Group, Table, Text } from '@mantine/core';
import { TableCollumn } from '@/src/view/TableView';
import { ActionsCollumnButtons } from './ActionsCollumnButtons';
import { TableExtraOptions } from './TableExtraOptions';

type ReagentsTableTheadProps<T> = {
  collumns: TableCollumn<T>[];
  onHideCollumn: (collumnName: string) => void;
  onShowCollumn: (collumnName: string) => void;
  onToggleSorting: (collumnName: string) => void;
};

export function TableThead<T>(props: ReagentsTableTheadProps<T>) {
  const [collumnHovered, setCollumnHovered] = useState<string | null>(null);

  return (
    <Table.Thead>
      <Table.Tr>
        {props.collumns
          .filter((collumn) => !collumn.hidden)
          .map((collumn, index) => (
            <Table.Th
              key={index}
              onMouseEnter={() => setCollumnHovered(collumn.name)}
              onMouseLeave={() => setCollumnHovered(null)}
            >
              <Group gap="5px" justify="flex-start">
                <Text fw="bold">{collumn.name}</Text>
                <ActionsCollumnButtons
                  fixed={collumn.fixed != null ? collumn.fixed : true}
                  sortable={collumn.sorter != null}
                  ascending={collumn.ascending != null ? collumn.ascending : null}
                  ishovered={collumn.name == collumnHovered}
                  onHandleHideCollumn={() => props.onHideCollumn(collumn.name)}
                  onToggleSorting={() => props.onToggleSorting(collumn.name)}
                />
              </Group>
            </Table.Th>
          ))}
        <Table.Th>
          <Group gap="5px" justify="center">
            <Text fw="bold">Ações</Text>
            <TableExtraOptions collumns={props.collumns} onShowCollumn={props.onShowCollumn} />
          </Group>
        </Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
}
