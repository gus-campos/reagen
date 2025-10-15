import { Flex, Grid, NumberInput, Select, Stack, Text } from '@mantine/core';
import { Item } from '@/src/models/item';
import { useData } from '@/src/providers/DataProvider';
import { formattedAmount } from '@/src/utils/formatted-amount';
import { formattedDate } from '@/src/utils/formatted-date';

type ItemShowProps = {
  item: Item;
};

export function ItemShow(props: ItemShowProps) {
  const { getReagentById } = useData();

  /* TODO: Incluir botão de edição? */

  return (
    <Stack p="md">
      <Grid>
        {/* ------------------------------------------------ */}

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text size="sm" c="dimmed">
            Reagente
          </Text>
          <Text fw={500}>{getReagentById(props.item.reagentId)?.name}</Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text size="sm" c="dimmed">
            Quantidade
          </Text>
          <Text fw={500}>{formattedAmount(props.item)}</Text>
        </Grid.Col>

        {/* ------------------------------------------------ */}

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text size="sm" c="dimmed">
            Pureza
          </Text>
          <Text fw={500}>{props.item.purity} %</Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text size="sm" c="dimmed">
            Vencimento
          </Text>
          <Text fw={500}>{formattedDate(props.item.expireDate)}</Text>
        </Grid.Col>

        {/* ------------------------------------------------ */}

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text size="sm" c="dimmed">
            Entrada
          </Text>
          <Text fw={500}>{formattedDate(props.item.inDate)}</Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text size="sm" c="dimmed">
            Saída
          </Text>
          <Text fw={500}>{props.item.outDate ? formattedDate(props.item.outDate) : '--'}</Text>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
