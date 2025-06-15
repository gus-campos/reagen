import { IconEdit, IconFileText, IconTrash } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';

type ActionsRowButtonsProps = {
  ishovered: boolean;
  handleDeleteReagent: () => void;
  beginReagentEdit: () => void;
  handleShowReagent: () => void;
};

export default function ActionsRowButtons({
  ishovered,
  handleDeleteReagent,
  beginReagentEdit,
  handleShowReagent,
}: ActionsRowButtonsProps) {
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
