import { Grid, Stack, Text } from '@mantine/core';
import { useData } from '@/src/providers/data.provider';
import { formattedDate } from '@/src/shared/utils/formatted-date';
import { formattedSize } from '../../size/size.util';
import { Package } from '../package.type';

type PackageShowProps = {
  pkg: Package;
};

export function PackageShow(props: PackageShowProps) {
  const { getReagentById, getBrandById, getSupplierById } = useData();

  return (
    <Stack p="md">
      <Grid>
        {/* ------------------------------------------------ */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text size="sm" c="dimmed">
            Reagente
          </Text>
          <Text fw={500}>{getReagentById(props.pkg.reagentId).name}</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text size="sm" c="dimmed">
            Tamanho
          </Text>
          <Text fw={500}>{formattedSize(props.pkg.size)}</Text>
        </Grid.Col>
        {/* ------------------------------------------------ */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text size="sm" c="dimmed">
            Pureza
          </Text>
          <Text fw={500}>{props.pkg.purity} %</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text size="sm" c="dimmed">
            Vencimento
          </Text>
          <Text fw={500}>{formattedDate(props.pkg.expireDate)}</Text>
        </Grid.Col>
        {/* ------------------------------------------------ */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text size="sm" c="dimmed">
            Entrada
          </Text>
          <Text fw={500}>{formattedDate(props.pkg.inDate)}</Text>
        </Grid.Col>
        {/* <Grid.Col span={{ base: 12, md: 6 }}>
          <Text size="sm" c="dimmed">
            Saída
          </Text>
          <Text fw={500}>{props.pkg.outDate ? formattedDate(props.pkg.outDate) : '--'}</Text>
        </Grid.Col> */}
        {/* ------------------------------------------------ */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text size="sm" c="dimmed">
            Marca
          </Text>
          <Text fw={500}>{props.pkg.brandId ? getBrandById(props.pkg.brandId).name : '--'}</Text>
        </Grid.Col>
        {/* ------------------------------------------------ */}
        {/* <Grid.Col span={{ base: 12, md: 6 }}>
          <Text size="sm" c="dimmed">
            Laboratório
          </Text>
          <Text fw={500}>
            {props.pkg.laboratoryId ? getLaboratoryById(props.pkg.laboratoryId).name : '--'}
          </Text>
        </Grid.Col> */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text size="sm" c="dimmed">
            Fornecedor
          </Text>
          <Text fw={500}>
            {props.pkg.supplierId ? getSupplierById(props.pkg.supplierId).name : '--'}
          </Text>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
