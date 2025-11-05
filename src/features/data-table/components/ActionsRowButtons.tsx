import { IconEdit, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Group } from '@mantine/core';
import { TableCrudOperations } from '../types/TableCrudOperations';

type ActionsRowButtonsProps<T> = {
  data: T;
  ishovered: boolean;
  crudOperations?: TableCrudOperations<T>;
};

export function ActionsRowButtons<T>(props: ActionsRowButtonsProps<T>) {
  const handleBeginDataEdit = () =>
    props.crudOperations?.handleBeginDataEdit
      ? props.crudOperations.handleBeginDataEdit(props.data)
      : undefined;

  const handleDeleteData = () =>
    props.crudOperations?.handleDeleteData
      ? props.crudOperations.handleDeleteData(props.data)
      : undefined;

  return (
    <>
      <Group gap="xs" justify="center">
        {handleBeginDataEdit && (
          <ActionIcon
            variant="transparent"
            color={props.ishovered ? 'blue' : 'lightgrey'}
            onClick={handleBeginDataEdit}
            size="20px"
          >
            <IconEdit />
          </ActionIcon>
        )}
        {handleDeleteData && (
          <ActionIcon
            variant="transparent"
            color={props.ishovered ? 'red' : 'lightgrey'}
            onClick={handleDeleteData}
            size="20px"
          >
            <IconTrash />
          </ActionIcon>
        )}
      </Group>
    </>
  );
}
