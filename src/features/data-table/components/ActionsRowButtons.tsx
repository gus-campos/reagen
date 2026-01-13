import { IconEdit, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Group } from '@mantine/core';
import { DataTableRealContextType, useDataTableContext } from '../providers/DataTableContext';

type ActionsRowButtonsProps<T> = {
  data: T;
  ishovered: boolean;
};

export function ActionsRowButtons<T>(props: ActionsRowButtonsProps<T>) {
  const { crudOperations, extraActions } = useDataTableContext() as DataTableRealContextType<T>;

  const handleBeginDataEdit = crudOperations?.handleBeginDataEdit
    ? () => crudOperations.handleBeginDataEdit!(props.data)
    : null;

  const handleDeleteData = crudOperations?.handleDeleteData
    ? () => crudOperations.handleDeleteData!(props.data)
    : null;

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
        {extraActions?.map((action, index) => (
          <ActionIcon
            variant="transparent"
            color={props.ishovered ? 'blue' : 'lightgrey'}
            onClick={() => action.action(props.data)}
            size="20px"
            key={index}
          >
            {action.icon}
          </ActionIcon>
        ))}
      </Group>
    </>
  );
}
