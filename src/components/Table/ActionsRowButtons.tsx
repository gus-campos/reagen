import { useContext } from 'react';
import { IconEdit, IconFileText, IconTrash } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';
import { CrudContext } from '@/src/pages/StockPage';
import { Reagent } from '@/src/typings/reagent';

type ActionsRowButtonsProps = {
  reagent: Reagent;
  ishovered: boolean;
};

export function ActionsRowButtons({ reagent, ishovered }: ActionsRowButtonsProps) {
  const { handleDeleteReagent, handleBeginReagentEdit, handleShowReagent } =
    useContext(CrudContext);

  return (
    <>
      <ActionIcon
        variant="transparent"
        opacity={ishovered ? 1 : 0}
        onClick={() => handleDeleteReagent(reagent)}
      >
        <IconTrash />
      </ActionIcon>

      <ActionIcon
        variant="transparent"
        opacity={ishovered ? 1 : 0}
        onClick={() => handleBeginReagentEdit(reagent)}
      >
        <IconEdit />
      </ActionIcon>

      <ActionIcon
        variant="transparent"
        opacity={ishovered ? 1 : 0}
        onClick={() => handleShowReagent(reagent)}
      >
        <IconFileText />
      </ActionIcon>
    </>
  );
}
