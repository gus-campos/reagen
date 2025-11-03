import { IconEdit, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Group } from '@mantine/core';
import { TableCrudOperations } from '../types/TableCrudOperations';

type ActionsRowButtonsProps<T> = {
  data: T;
  ishovered: boolean;
  crudOperations?: TableCrudOperations<T>;
};

export function ActionsRowButtons<T>(props: ActionsRowButtonsProps<T>) {
  return (
    <>
      <Group gap="xs" justify="center">
        {props.crudOperations?.handleBeginDataEdit && (
          <ActionIcon
            variant="transparent"
            color={props.ishovered ? 'blue' : 'lightgrey'}
            onClick={() => props.crudOperations!.handleBeginDataEdit!(props.data)}
            size="20px"
          >
            <IconEdit />
          </ActionIcon>
        )}
        {props.crudOperations?.handleDeleteData && (
          <ActionIcon
            variant="transparent"
            color={props.ishovered ? 'red' : 'lightgrey'}
            onClick={() => props.crudOperations!.handleDeleteData!(props.data)}
            size="20px"
          >
            <IconTrash />
          </ActionIcon>
        )}
      </Group>
    </>
  );
}
