import { useState } from 'react';
import { Group, Table, Text } from '@mantine/core';
import { ActionsCollumnButtons } from './ActionsCollumnButtons';
import { TableCollumn } from './DataTable';

type ReagentsTableTheadProps<T> = {
  collumns: TableCollumn<T>[];
  onHideCollumn: (collumnName: string) => void;
};

export function TableThead<T>({ collumns, onHideCollumn }: ReagentsTableTheadProps<T>) {
  const [collumnHovered, setCollumnHovered] = useState<string | null>(null);

  return (
    <Table.Thead>
      <Table.Tr>
        {/* Para todas as colunas que devem ser exibidas, incluir um nome no cabeçalho, e botões, se for o caso */}
        {collumns
          .filter((collumn) => !collumn.hidden)
          .map((collumn, index) => (
            <Table.Th
              key={index}
              onMouseEnter={() => setCollumnHovered(collumn.name)}
              onMouseLeave={() => setCollumnHovered(null)}
            >
              <Group gap="xs" justify="flex-start">
                <Text>{collumn.name}</Text>
                {!collumn.fixed && (
                  <ActionsCollumnButtons
                    ishovered={collumn.name == collumnHovered}
                    onHandleHideCollumn={() => onHideCollumn(collumn.name)}
                  />
                )}
              </Group>
            </Table.Th>
          ))}
      </Table.Tr>
    </Table.Thead>
  );
}
