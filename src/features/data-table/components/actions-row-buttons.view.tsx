import { useState } from 'react';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Group, Popover } from '@mantine/core';
import {
  DataTableRealContextType,
  useDataTableContext,
} from '@/features/data-table/data-table.provider';

type ActionsRowButtonsProps<T> = {
  data: T;
  isHovered: boolean;
};

export function ActionsRowButtons<T>(props: ActionsRowButtonsProps<T>) {
  const { crudOperations, extraActions } = useDataTableContext() as DataTableRealContextType<T>;
  const [popoverOpened, setPopoverOpened] = useState<number | null>(null);

  const handleBeginDataEdit = crudOperations?.handleBeginDataEdit
    ? () => crudOperations.handleBeginDataEdit!(props.data)
    : null;

  const handleDeleteData = crudOperations?.handleDeleteData
    ? () => crudOperations.handleDeleteData!(props.data)
    : null;

  const actionActive =
    extraActions?.filter((action) => !action.show || action.show(props.data)) ?? [];

  return (
    <>
      <Group gap="xs" justify="center">
        {handleBeginDataEdit && (
          <ActionIcon
            variant="transparent"
            color={props.isHovered ? 'blue' : 'lightgrey'}
            onClick={handleBeginDataEdit}
            size="20px"
          >
            <IconEdit />
          </ActionIcon>
        )}
        {handleDeleteData && (
          <ActionIcon
            variant="transparent"
            color={props.isHovered ? 'red' : 'lightgrey'}
            onClick={handleDeleteData}
            size="20px"
          >
            <IconTrash />
          </ActionIcon>
        )}
        {actionActive.map((action, index) => (
          <Popover
            key={index}
            opened={popoverOpened === index}
            onOpen={action.popover?.onOpen ? () => action.popover!.onOpen!(props.data) : undefined}
            onChange={(opened) => setPopoverOpened(opened ? index : null)}
            onClose={() => action.popover?.onClose && action.popover.onClose(props.data)}
            shadow="xl"
            radius="lg"
            withArrow
            arrowSize={28}
          >
            <Popover.Target>
              <ActionIcon
                variant="transparent"
                color={props.isHovered ? 'blue' : 'lightgrey'}
                size="20px"
                onClick={() => {
                  // Execução da action
                  action.action && action.action(props.data);
                  // para abrir, e para fechar se clicar de novo
                  if (action.popover) setPopoverOpened(popoverOpened === null ? index : null);
                }}
              >
                {action.icon}
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
              {action.popover?.render({
                closePopover: () => setPopoverOpened(null),
                data: props.data,
              })}
            </Popover.Dropdown>
          </Popover>
        ))}
      </Group>
    </>
  );
}
