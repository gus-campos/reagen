import { IconEye } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';

type ActionsCollumnButtonsProps = {
  ishovered: boolean;
  handleHideCollumn: () => void;
};

export default function ActionsCollumnButtons({
  ishovered,
  handleHideCollumn,
}: ActionsCollumnButtonsProps) {
  return (
    <>
      <ActionIcon variant="transparent" opacity={ishovered ? 1 : 0} onClick={handleHideCollumn}>
        <IconEye />
      </ActionIcon>
    </>
  );
}
