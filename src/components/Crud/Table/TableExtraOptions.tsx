import { IconEye } from '@tabler/icons-react';
import { ActionIcon, Group, Menu, Table } from '@mantine/core';
import { TableCollumn } from '@/src/view/TableView';

type TableExtraOptionsProps<T> = {
  collumns: TableCollumn<T>[];
  onShowCollumn: (collumnName: string) => void;
};

export function TableExtraOptions<T>(props: TableExtraOptionsProps<T>) {
  const hiddenCollumns = props.collumns.filter((collumn) => collumn.hidden);

  return (
    <Table.Th>
      {hiddenCollumns.length > 0 && (
        <Menu>
          <Menu.Target>
            <Group justify="end">
              <ActionIcon variant="transparent">
                <IconEye size="20px" color="grey" />
              </ActionIcon>
            </Group>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Reexibir coluna</Menu.Label>
            {props.collumns
              .filter((collumn) => collumn.hidden)
              .map((collumn, index) => (
                <Menu.Item key={index} onClick={() => props.onShowCollumn(collumn.name)}>
                  {collumn.name}
                </Menu.Item>
              ))}
          </Menu.Dropdown>
        </Menu>
      )}
    </Table.Th>
  );
}
