import { IconEyeOff } from '@tabler/icons-react';
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
  const { hovered, ref } = useHover();

  const primaryColor = theme.colors[theme.primaryColor][theme.primaryShade as number];

  // Hide
  const hideOptionOpacity = hovered ? 1 : 0;
  const sortOptionOpacity = props.ascending !== null ? 1 : hovered ? 1 : 0;

  // Direção da ordenação
  const ascendingColor = props.ascending === false ? primaryColor : 'grey';
  const descendingColor = props.ascending === true ? primaryColor : 'grey';

  return (
    <Group gap="3px" ref={ref}>
      {props.sortable && (
        <ActionIcon
          style={{ '--ai-size': '20px' }}
          variant="transparent"
          opacity={sortOptionOpacity}
          onClick={props.onToggleSorting}
        >
          <FaArrowDownLong color={ascendingColor} size="17px" />
          <FaArrowUpLong color={descendingColor} size="17px" />
        </ActionIcon>
      )}
      {!props.fixed && (
        <ActionIcon
          style={{ '--ai-size': '20px' }}
          variant="transparent"
          opacity={hideOptionOpacity}
          onClick={props.onHandleHideCollumn}
        >
          <IconEyeOff color="gray" size="20px" />
        </ActionIcon>
      )}
    </Group>
  );
}
