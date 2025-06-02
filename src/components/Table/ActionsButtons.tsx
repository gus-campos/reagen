import { IconEdit, IconFileText, IconTrash } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';

type ActionsButtonsProps = {
  ishovered: boolean;
  handleDeleteReagent: () => void;
  beginReagentEdit: () => void;
  handleShowReagent: () => void;
};

export default function ActionsButtons({
  ishovered,
  handleDeleteReagent,
  beginReagentEdit,
  handleShowReagent,
}: ActionsButtonsProps) {
  return (
    <>
      <ActionIcon variant="transparent" opacity={ishovered ? 1 : 0} onClick={handleDeleteReagent}>
        <IconTrash />
      </ActionIcon>

      <ActionIcon variant="transparent" opacity={ishovered ? 1 : 0} onClick={beginReagentEdit}>
        <IconEdit />
      </ActionIcon>

      <ActionIcon variant="transparent" opacity={ishovered ? 1 : 0} onClick={handleShowReagent}>
        <IconFileText />
      </ActionIcon>
    </>
  );
}
