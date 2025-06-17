import { useState } from 'react';
import { Group, Table, Text } from '@mantine/core';
import { ActionsCollumnButtons } from './ActionsCollumnButtons';

type ReagentsTableTheadProps = {
  fixedCollumns: string[];
  collumnsShown: Record<string, boolean>;
  onHideCollumn: (collumnName: string) => void;
};

export function ReagentsTableThead({
  fixedCollumns,
  collumnsShown,
  onHideCollumn,
}: ReagentsTableTheadProps) {
  const [collumnHovered, setCollumnHovered] = useState<string | null>(null);

  return (
    <Table.Thead>
      <Table.Tr>
        {/* Para todas as colunas que devem ser exibidas, incluir um nome no cabeçalho, e botões, se for o caso */}
        {Object.keys(collumnsShown)
          .filter((collumnsName) => collumnsShown[collumnsName])
          .map((collumnName, index) => (
            <Table.Th
              key={index}
              onMouseEnter={() => setCollumnHovered(collumnName)}
              onMouseLeave={() => setCollumnHovered(null)}
            >
              <Group gap="xs" justify="flex-start">
                <Text>{collumnName}</Text>
                {!fixedCollumns.includes(collumnName) && (
                  <ActionsCollumnButtons
                    ishovered={collumnName == collumnHovered}
                    onHandleHideCollumn={() => onHideCollumn(collumnName)}
                  />
                )}
              </Group>
            </Table.Th>
          ))}
      </Table.Tr>
    </Table.Thead>
  );
}
