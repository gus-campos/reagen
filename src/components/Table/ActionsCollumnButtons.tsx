import { IconEye, IconSortAscending2, IconSortDescending2 } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';

type ActionsCollumnButtonsProps = {
  ishovered: boolean;
  onHandleHideCollumn: () => void;
};

export function ActionsCollumnButtons({
  ishovered,
  onHandleHideCollumn,
}: ActionsCollumnButtonsProps) {
  return (
    <>
      <ActionIcon variant="transparent" opacity={ishovered ? 1 : 0} onClick={onHandleHideCollumn}>
        <IconEye />
      </ActionIcon>

      <ActionIcon variant="transparent" opacity={ishovered ? 1 : 0}>
        <IconSortDescending2 />
      </ActionIcon>
    </>
  );
}
