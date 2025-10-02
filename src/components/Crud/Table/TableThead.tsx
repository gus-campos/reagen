import { Group, Table, Text } from "@mantine/core";
import { TableCollumn } from "@/src/components/Crud/Table/TableView";
import { ActionsCollumnButtons } from "./ActionsCollumnButtons";
import { TableExtraOptions } from "./TableExtraOptions";

type ReagentsTableTheadProps<T> = {
  collumns: TableCollumn<T>[];
  onHideCollumn: (collumnName: string) => void;
  onShowCollumn: (collumnName: string) => void;
  onToggleSorting: (collumnName: string) => void;
};

export function TableThead<T>(props: ReagentsTableTheadProps<T>) {
  return (
    <Table.Thead>
      <Table.Tr>
        {props.collumns
          .filter((collumn) => !collumn.hidden)
          .map((collumn, index) => (
            <Table.Th key={index}>
              <Group gap="5px" justify="flex-start">
                <Text size="md" fw="bold">
                  {collumn.name}
                </Text>
                <ActionsCollumnButtons
                  fixed={collumn.fixed != null ? collumn.fixed : true}
                  sortable={collumn.sorter != null}
                  ascending={
                    collumn.ascending != null ? collumn.ascending : null
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
              onShowCollumn={props.onShowCollumn}
            />
          </Group>
        </Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
}
