import { IconEye, IconEyeOff, IconSortAscending2, IconSortDescending2 } from '@tabler/icons-react';
import { FaArrowDownLong, FaArrowUpLong } from 'react-icons/fa6';
import { ActionIcon, Group, useMantineTheme } from '@mantine/core';
import { useHover } from '@mantine/hooks';

type ActionsCollumnButtonsProps = {
  fixed: boolean;
  ascending: boolean | null;
  sortable: boolean;
  onHandleHideCollumn: () => void;
  onToggleSorting: () => void;
};

export function ActionsCollumnButtons(props: ActionsCollumnButtonsProps) {
  const theme = useMantineTheme();
  const blue = theme.colors[theme.primaryColor][theme.primaryShade as number];

  const { hovered, ref } = useHover();

  return (
    <Group gap="3px" ref={ref}>
      {props.sortable && (
        <ActionIcon
          style={{ '--ai-size': '20px' }}
          variant="transparent"
          opacity={props.ascending !== null ? 1 : hovered ? 1 : 0}
          onClick={props.onToggleSorting}
        >
          <FaArrowDownLong color={props.ascending === false ? blue : 'grey'} size="17px" />
          <FaArrowUpLong color={props.ascending === true ? blue : 'grey'} size="17px" />
        </ActionIcon>
      )}
      {!props.fixed && (
        <ActionIcon
          style={{ '--ai-size': '20px' }}
          variant="transparent"
          opacity={hovered ? 1 : 0}
          onClick={props.onHandleHideCollumn}
        >
          <IconEyeOff color="gray" size="20px" />
        </ActionIcon>
      )}
    </Group>
  );
}
