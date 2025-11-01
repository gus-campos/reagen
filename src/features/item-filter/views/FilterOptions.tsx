import { useEffect } from 'react';
import { Accordion, Box, Grid, Group, Paper, Radio, Select, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { ItemsFilter } from '@/src/features/items/types/items-filter';
import { useData } from '@/src/providers/DataProvider';
import { toNullableLocalDate } from '@/src/shared/utils/date';
import { portugueseSearchFilter } from '@/src/shared/utils/portuguese-search-filter';

type FilterOptionsProps = {
  filter: ItemsFilter;
  onFilterChange: (filter: ItemsFilter) => void;
};

export function FilterOptions(props: FilterOptionsProps) {
  const { controlAgencies, brands } = useData();

  const form = useForm<ItemsFilter>({
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

  return (
    <>
      <Box>
        <Paper withBorder radius="sm" py="md" px="md">
          <Title order={4} mb="sm">
            Filtros
          </Title>

          <form>
            <Accordion variant="default">
              {/* Vencimento */}
              <Accordion.Item value="expire-date">
                <Accordion.Control>Por vencimento</Accordion.Control>
                <Accordion.Panel>
                  {/* Por range de data */}
                  <Radio.Group
                    label="Mostrar"
                    defaultValue="all"
                    {...form.getInputProps('expired')}
                  >
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
                <Accordion.Control>Por controle</Accordion.Control>
                <Accordion.Panel>
                  <Radio.Group
                    label="Mostrar"
                    defaultValue="all"
                    {...form.getInputProps('controlled')}
                  >
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
                <Accordion.Control>Por marca</Accordion.Control>
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
            </Accordion>
          </form>

          <Title order={4} mb="sm" mt="md">
            Opções
          </Title>

          <Accordion>
            <Accordion.Item value="view-mode">
              <Accordion.Control>Modo de visualização</Accordion.Control>
              <Accordion.Panel>
                <Radio.Group defaultValue="byItem" defaultChecked unselectable="off">
                  <Group>
                    <Radio label="Por itens" value="byItem" />
                    <Radio label="Agrupado" value="grouped" />
                  </Group>
                </Radio.Group>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Paper>
      </Box>
    </>
  );
}
