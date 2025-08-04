import { useContext } from 'react';
import { IconEdit, IconFileText, IconTrash } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';
import { CrudOperations } from './DataTable';

type ActionsRowButtonsProps<T> = {
  data: T;
  ishovered: boolean;
  crudOperations: CrudOperations<T>;
};

export function ActionsRowButtons<T>({
  data,
  ishovered,
  crudOperations,
}: ActionsRowButtonsProps<T>) {
  return (
    <>
      <ActionIcon
        variant="transparent"
        opacity={ishovered ? 1 : 0}
        onClick={() => crudOperations.handleDeleteData(data)}
      >
        <IconTrash />
      </ActionIcon>

      <ActionIcon
        variant="transparent"
        opacity={ishovered ? 1 : 0}
        onClick={() => crudOperations.handleBeginDataEdit(data)}
      >
        <IconEdit />
      </ActionIcon>

      <ActionIcon
        variant="transparent"
        opacity={ishovered ? 1 : 0}
        onClick={() => crudOperations.handleShowData(data)}
      >
        <IconFileText />
      </ActionIcon>
    </>
  );
}
