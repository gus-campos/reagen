import { useContext } from 'react';
import { IconEdit, IconFileText, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Group } from '@mantine/core';
import { CrudOperations } from '@/src/components/Crud/Table/TableView';

type ActionsRowButtonsProps<T> = {
  data: T;
  ishovered: boolean;
  crudOperations?: CrudOperations<T>;
};

export function ActionsRowButtons<T>(props: ActionsRowButtonsProps<T>) {
  return (
    <>
      {props.crudOperations && (
        <Group gap="xs" justify="center">
          <ActionIcon
            variant="transparent"
            color={props.ishovered ? 'blue' : 'lightgrey'}
            onClick={() => props.crudOperations!.handleBeginDataEdit(props.data)}
            size="20px"
          >
            <IconEdit />
          </ActionIcon>

          <ActionIcon
            variant="transparent"
            color={props.ishovered ? 'red' : 'lightgrey'}
            onClick={() => props.crudOperations!.handleDeleteData(props.data)}
            size="20px"
          >
            <IconTrash />
          </ActionIcon>
        </Group>
      )}
    </>
  );
}
