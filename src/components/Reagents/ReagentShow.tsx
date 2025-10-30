import { Grid, Stack, Text } from '@mantine/core';
import { Reagent } from '@/src/models/reagent';
import { useAppData } from '@/src/providers/DataProvider';

type ItemShowProps = {
  reagent: Reagent;
};

export function ReagentShow(props: ItemShowProps) {
  /* TODO: Incluir botão de edição do nome */

  const { getControlAgencyById } = useAppData();

  const controlAgency = props.reagent.controlAgencyId
    ? getControlAgencyById(props.reagent.controlAgencyId)
    : null;

  return (
    <Stack p="md">
      <Grid>
        {/* ------------------------------------------------ */}

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text size="sm" c="dimmed">
            Nome
          </Text>
          <Text fw={500}>{props.reagent.name}</Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text size="sm" c="dimmed">
            Dimensão
          </Text>
          <Text fw={500}>{props.reagent.dimension}</Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text size="sm" c="dimmed">
            Orgão de Controle
          </Text>
          <Text fw={500}>{controlAgency?.name ?? '--'}</Text>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
