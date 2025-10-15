import { IconEye } from '@tabler/icons-react';
import { ActionIcon, Group, Menu, Table } from '@mantine/core';
import { TableCollumn } from '@/src/components/Crud/Table/TableView';

type TableExtraOptionsProps<T> = {
  collumns: TableCollumn<T>[];
  hiddenColunms: string[];
  onShowCollumn: (collumnName: string) => void;
};

export function TableExtraOptions<T>(props: TableExtraOptionsProps<T>) {
  const hiddenCollumns = props.collumns.filter((collumn) =>
    props.hiddenColunms.includes(collumn.name)
  );

  return (
    <>
      {hiddenCollumns.length > 0 && (
        <Menu>
          <Menu.Target>
            <Group gap={0} justify="end">
              <ActionIcon style={{ '--ai-size': '20px' }} variant="transparent">
                <IconEye size="20px" color="grey" />
              </ActionIcon>
            </Group>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Reexibir coluna</Menu.Label>
            {props.collumns
              .filter((collumn) => hiddenCollumns.includes(collumn))
              .map((collumn, index) => (
                <Menu.Item key={index} onClick={() => props.onShowCollumn(collumn.name)}>
                  {collumn.name}
                </Menu.Item>
              ))}
          </Menu.Dropdown>
        </Menu>
      )}
    </>
  );
}
