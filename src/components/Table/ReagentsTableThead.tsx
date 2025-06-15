import { useState } from 'react';
import { Table } from '@mantine/core';
import ActionsCollumnButtons from './ActionsCollumnButtons';

type ReagentsTableTheadProps = {
  collumnsNames: string[];
  fixedCollumns: string[];
  collumnsShown: Record<string, boolean>;
  hideCollumn: (collumnName: string) => void;
};

export function ReagentsTableThead({
  collumnsNames,
  fixedCollumns,
  collumnsShown,
  hideCollumn,
}: ReagentsTableTheadProps) {
  const [collumnsHovered, setCollumnsHovered] = useState(collumnsNames.map(() => false));

  return (
    <Table.Thead>
      <Table.Tr>
        {Object.keys(collumnsShown)
          .filter((collumnsName) => collumnsShown[collumnsName])
          .map((collumnName, index) => (
            <Table.Th
              key={index}
              onMouseEnter={() =>
                setCollumnsHovered(collumnsHovered.map((_, indexHovered) => indexHovered == index))
              }
              onMouseLeave={() => setCollumnsHovered(collumnsHovered.map(() => false))}
            >
              {collumnName}
              {!fixedCollumns.includes(collumnName) && (
                <ActionsCollumnButtons
                  ishovered={collumnsHovered[index]}
                  handleHideCollumn={() => hideCollumn(collumnName)}
                />
              )}
            </Table.Th>
          ))}
      </Table.Tr>
    </Table.Thead>
  );
}

export default ReagentsTableThead;
