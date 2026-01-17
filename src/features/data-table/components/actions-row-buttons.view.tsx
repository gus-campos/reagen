import { useState } from 'react';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Group, Popover, Stack, Tooltip } from '@mantine/core';
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
          <Tooltip label="Editar">
            <ActionIcon
              variant="transparent"
              color={props.isHovered ? 'blue' : 'lightgrey'}
              onClick={handleBeginDataEdit}
              size="20px"
            >
              <IconEdit />
            </ActionIcon>
          </Tooltip>
        )}
        {handleDeleteData && (
          <Tooltip label="Deletar">
            <ActionIcon
              variant="transparent"
              color={props.isHovered ? 'red' : 'lightgrey'}
              onClick={handleDeleteData}
              size="20px"
            >
              <IconTrash />
            </ActionIcon>
          </Tooltip>
        )}
        {actionActive.map((action, index) => (
          <Popover
            key={index}
            opened={popoverOpened === index}
            onOpen={action.popover?.onOpen ? () => action.popover!.onOpen!(props.data) : undefined}
            onChange={(opened) => setPopoverOpened(opened ? index : null)}
            onClose={() => action.popover?.onClose && action.popover.onClose(props.data)}
            withinPortal={false}
            trapFocus={false}
            radius="md"
            withArrow
            arrowPosition="side"
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
            <Popover.Dropdown
              style={{
                boxShadow: '0 0 20px rgba(0,0,0,0.40)',
              }}
            >
              <Stack
                // Para impedir que o click no conteúdo feche o popover
                onMouseDown={(e) => e.stopPropagation()}
              >
                {action.popover?.render({
                  closePopover: () => setPopoverOpened(null),
                  data: props.data,
                })}
              </Stack>
            </Popover.Dropdown>
          </Popover>
        ))}
      </Group>
    </>
  );
}
