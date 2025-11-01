import { Grid, Stack, Text } from '@mantine/core';
import { Item } from '@/src/features/items/types/item';
import { useData } from '@/src/providers/DataProvider';
import { formattedDate } from '@/src/shared/utils/formatted-date';
import { formattedAmount } from '../../reagents/utils/formatted-amount';

type ItemShowProps = {
  item: Item;
};

export function ItemShow(props: ItemShowProps) {
  const {
    getReagentById,
    getBrandById,
    getLaboratoryById,
    getSupplierById,
    getControlAgencyById: getControlAgenciesById,
  } = useData();

  /* TODO: Incluir botão de edição? */

  const controlAgencyId = getReagentById(props.item.reagentId).controlAgencyId;
  const controlAgency = controlAgencyId ? getControlAgenciesById(controlAgencyId) : null;

  return (
    <Stack p="md">
      <Grid>
        {/* ------------------------------------------------ */}

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text size="sm" c="dimmed">
            Reagente
          </Text>
          <Text fw={500}>{getReagentById(props.item.reagentId).name}</Text>
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

        {/* ------------------------------------------------ */}

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text size="sm" c="dimmed">
            Marca
          </Text>
          <Text fw={500}>{props.item.brandId ? getBrandById(props.item.brandId).name : '--'}</Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text size="sm" c="dimmed">
            Orgão de controle
          </Text>
          <Text fw={500}>{controlAgency?.name ?? '--'}</Text>
        </Grid.Col>

        {/* ------------------------------------------------ */}

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text size="sm" c="dimmed">
            Laboratório
          </Text>
          <Text fw={500}>
            {props.item.laboratoryId ? getLaboratoryById(props.item.laboratoryId).name : '--'}
          </Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text size="sm" c="dimmed">
            Fornecedor
          </Text>
          <Text fw={500}>
            {props.item.supplierId ? getSupplierById(props.item.supplierId).name : '--'}
          </Text>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
