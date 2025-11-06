import { useEffect } from 'react';
import {
  Accordion,
  Badge,
  Box,
  Grid,
  Group,
  Paper,
  Radio,
  Select,
  Switch,
  Title,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { ItemFilter } from '@/src/features/item-filter/types/items-filter';
import { useData } from '@/src/providers/DataProvider';
import { ViewMode } from '@/src/shared/pages/StockPage';
import { toNullableLocalDate } from '@/src/shared/utils/date';
import { portugueseSearchFilter } from '@/src/shared/utils/portuguese-search-filter';

type FilterOptionsProps = {
  filter: ItemFilter;
  viewMode: ViewMode;
  onFilterChange: (filter: ItemFilter) => void;
  onViewModeChange: (viewMode: ViewMode) => void;
};

function TouchedBadge(props: { text: string; active: boolean }) {
  return (
    <Group gap="xs">
      {props.text}
      {props.active && <Badge circle size="10px" color="cyan" />}
    </Group>
  );
}

export function FilterOptions(props: FilterOptionsProps) {
  const { controlAgencies, brands, suppliers, laboratories } = useData();

  const form = useForm<ItemFilter>({
    initialValues: props.filter,
    transformValues: (values) => ({
      ...values,
      minExpire: toNullableLocalDate(values.minExpire),
      maxExpire: toNullableLocalDate(values.maxExpire),
    }),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      props.onFilterChange(form.getTransformedValues());
    }, 500);

    return () => clearTimeout(timer);
  }, [form.values]);

  // TODO: Adicionar opções de filtro por laboratório, fornecedor

  // FIXME: selo indicando opção não nula de filtro

  return (
    <Paper withBorder radius="sm" py="md" px="md">
      <Title order={4} mb="sm">
        Modo de visualização
      </Title>

      <Switch
        label="Ativar visualização agrupada"
        mt="md"
        mb="lg"
        onChange={(e) => {
          const groupedViewActive = e.currentTarget.checked;
          props.onViewModeChange(groupedViewActive ? 'grouped' : 'simple');
        }}
      />

      <Title order={4} mb="sm">
        Filtros
      </Title>

      <form>
        <Accordion variant="default">
          {/* Vencimento */}
          <Accordion.Item value="expire-date">
            <Accordion.Control>
              <Group>
                <TouchedBadge
                  active={
                    form.values.expired !== 'all' ||
                    !!form.values.minExpire ||
                    !!form.values.maxExpire
                  }
                  text="Por vencimento"
                />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              {/* Range de data */}
              <Radio.Group label="Mostrar" defaultValue="all" {...form.getInputProps('expired')}>
                <Radio label="Todos" value="all"></Radio>
                <Radio label="Apenas vencidos" value="expired"></Radio>
                <Radio label="Apenas não vencidos" value="not-expired"></Radio>
              </Radio.Group>
              <Grid mt="md">
                <Grid.Col span={{ base: 6 }}>
                  <DatePickerInput
                    clearable
                    valueFormat="DD/MM/YYYY"
                    label="A partir de"
                    placeholder="Selecione"
                    {...form.getInputProps('minExpire')}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 6 }}>
                  <DatePickerInput
                    clearable
                    valueFormat="DD/MM/YYYY"
                    label="Até"
                    placeholder="Selecione"
                    {...form.getInputProps('maxExpire')}
                  />
                </Grid.Col>
              </Grid>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="controlled">
            <Accordion.Control>
              <TouchedBadge
                active={form.values.controlled !== 'all' || !!form.values.controlAgencyId}
                text="Por controle"
              />
            </Accordion.Control>
            <Accordion.Panel>
              <Radio.Group label="Mostrar" defaultValue="all" {...form.getInputProps('controlled')}>
                <Radio label="Todos" value="all"></Radio>
                <Radio label="Apenas controlados" value="controlled"></Radio>
                <Radio label="Apenas não controlados" value="not-controlled"></Radio>
              </Radio.Group>

              <Select
                clearable
                mt="md"
                label="Orgão de controle"
                placeholder="Escolha o orgão de controle"
                data={controlAgencies!.map((c) => {
                  return { value: c.id, label: c.name };
                })}
                onChange={(value) => {
                  form.setValues({ controlAgencyId: value ? value : null });
                }}
                filter={portugueseSearchFilter}
              />
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="byBrand">
            <Accordion.Control>
              <TouchedBadge active={form.values.brandId !== null} text="Por marca" />
            </Accordion.Control>
            <Accordion.Panel>
              <Select
                clearable
                mt="md"
                label="Marca"
                placeholder="Escolha a marca"
                data={brands!.map((b) => {
                  return { value: b.id, label: b.name };
                })}
                onChange={(value) => {
                  form.setValues({ brandId: value ? value : null });
                }}
                filter={portugueseSearchFilter}
              />
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="byLaboratory">
            <Accordion.Control>
              <TouchedBadge active={form.values.laboratoryId !== null} text="Por laboratório" />
            </Accordion.Control>
            <Accordion.Panel>
              <Select
                clearable
                mt="md"
                label="Laboratório"
                placeholder="Escolha o laboratório"
                data={laboratories!.map((l) => {
                  return { value: l.id, label: l.name };
                })}
                onChange={(value) => {
                  form.setValues({ laboratoryId: value ? value : null });
                }}
                filter={portugueseSearchFilter}
              />
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="bySupplier">
            <Accordion.Control>
              <TouchedBadge active={form.values.supplierId !== null} text="Por fornecedor" />
            </Accordion.Control>
            <Accordion.Panel>
              <Select
                clearable
                mt="md"
                label="Fornecedor"
                placeholder="Escolha o fornecedor"
                data={suppliers!.map((s) => {
                  return { value: s.id, label: s.name };
                })}
                onChange={(value) => {
                  form.setValues({ supplierId: value ? value : null });
                }}
                filter={portugueseSearchFilter}
              />
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </form>
    </Paper>
  );
}
