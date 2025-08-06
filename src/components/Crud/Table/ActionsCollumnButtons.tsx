import { IconEye, IconEyeOff, IconSortAscending2, IconSortDescending2 } from '@tabler/icons-react';
import { ActionIcon, Group } from '@mantine/core';

type ActionsCollumnButtonsProps = {
  fixed: boolean;
  ascending: boolean | null;
  ishovered: boolean;
  sortable: boolean;
  onHandleHideCollumn: () => void;
  onToggleSorting: () => void;
};

export function ActionsCollumnButtons(props: ActionsCollumnButtonsProps) {
  const opacity = props.ishovered ? 1 : 0;

  return (
    <Group gap={0}>
      {props.sortable && (
        <ActionIcon
          style={{ '--ai-size': '20px' }}
          variant="transparent"
          opacity={opacity}
          onClick={props.onToggleSorting}
        >
          <>
            {props.ascending == null ? (
              <IconSortDescending2 color="gray" size="20px" />
            ) : props.ascending ? (
              <IconSortAscending2 size="20px" />
            ) : (
              <IconSortDescending2 size="20px" />
            )}
          </>
        </ActionIcon>
      )}
      {!props.fixed && (
        <ActionIcon
          style={{ '--ai-size': '20px' }}
          variant="transparent"
          opacity={opacity}
          onClick={props.onHandleHideCollumn}
        >
          <IconEyeOff color="gray" size="20px" />
        </ActionIcon>
      )}
    </Group>
  );
}
