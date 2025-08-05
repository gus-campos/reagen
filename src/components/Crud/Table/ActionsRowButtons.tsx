import { useContext } from 'react';
import { IconEdit, IconFileText, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Group } from '@mantine/core';
import { CrudOperations } from '@/src/view/TableView';

type ActionsRowButtonsProps<T> = {
  data: T;
  ishovered: boolean;
  crudOperations?: CrudOperations<T>;
};

export function ActionsRowButtons<T>(props: ActionsRowButtonsProps<T>) {
  const iconColors = props.ishovered ? 'blue' : 'lightgrey';

  return (
    <>
      {props.crudOperations && (
        <Group gap="xs" justify="center">
          <ActionIcon
            variant="transparent"
            color={iconColors}
            onClick={() => props.crudOperations!.handleDeleteData(props.data)}
            size="20px"
          >
            <IconTrash />
          </ActionIcon>

          <ActionIcon
            variant="transparent"
            color={iconColors}
            onClick={() => props.crudOperations!.handleBeginDataEdit(props.data)}
            size="20px"
          >
            <IconEdit />
          </ActionIcon>

          <ActionIcon
            variant="transparent"
            color={iconColors}
            onClick={() => props.crudOperations!.handleShowData(props.data)}
            size="20px"
          >
            <IconFileText />
          </ActionIcon>
        </Group>
      )}
    </>
  );
}
