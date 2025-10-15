import { useEffect } from 'react';
import { Accordion, Box, Grid, Group, Paper, Radio, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import ItemsFilter from '@/src/models/items-filter';
import { Reagent } from '@/src/models/reagent';
import { toNullableLocalDate } from '@/src/utils/date';

type FilterOptionsProps = {
  filter: ItemsFilter;
  onFilterChange: (filter: ItemsFilter) => void;
  reagent: Reagent | null;
};

export function FilterOptions(props: FilterOptionsProps) {
  const form = useForm<ItemsFilter>({
    initialValues: props.filter,
    transformValues: (values) => ({
      ...values,
      minDate: toNullableLocalDate(values.minDate),
      maxDate: toNullableLocalDate(values.maxDate),
    }),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (form.isTouched()) {
        props.onFilterChange(form.getTransformedValues());
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.values]);

  return (
    <>
      <Box>
        <Paper radius="sm" withBorder style={{ padding: '10px' }}>
          <Title order={4} mb="sm">
            Filtros
          </Title>

          <form>
            <Accordion
              variant="default"
              styles={{
                control: {
                  padding: '4px 8px',
                  height: '32px',
                  fontSize: '0.9rem',
                },
              }}
            >
              <Accordion.Item value="expireDate">
                <Accordion.Control>Por vencimento</Accordion.Control>
                <Accordion.Panel>
                  <Grid>
                    <Grid.Col span={{ base: 6 }}>
                      <DatePickerInput
                        clearable
                        valueFormat="DD/MM/YYYY"
                        label="A partir de"
                        placeholder="Selecione"
                        {...form.getInputProps('minDate')}
                      />
                    </Grid.Col>

                    <Grid.Col span={{ base: 6 }}>
                      <DatePickerInput
                        clearable
                        valueFormat="DD/MM/YYYY"
                        label="Até"
                        placeholder="Selecione"
                        {...form.getInputProps('maxDate')}
                      />
                    </Grid.Col>
                  </Grid>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </form>

          <Title order={4} mb="sm" mt="md">
            Opções
          </Title>

          <Accordion
            styles={{
              control: {
                padding: '4px 8px',
                height: '32px',
                fontSize: '0.9rem',
              },
            }}
          >
            <Accordion.Item value="viewMode">
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
