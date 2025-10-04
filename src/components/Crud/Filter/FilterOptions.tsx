import { useEffect } from 'react';
import { Box, Grid, NumberInput, Paper, Select } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import ItemsFilter from '@/src/models/items-filter';
import { Reagent } from '@/src/models/reagent';
import { Dimension, DimensionDefaultUnit } from '@/src/models/unit';
import { toNullableLocalDate } from '@/src/utils/date';
import { SearchBar } from './SearchBar';

type FilterOptionsProps = {
  search: string;
  filter: ItemsFilter;
  onSearchChange: (search: string) => void;
  onFilterChange: (filter: ItemsFilter) => void;
  onReagentChange: (reagent: Reagent | null) => void;
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

  const defaultUnit = form.values.dimension ? DimensionDefaultUnit[form.values.dimension] : null;
  const parenthesizedUnit = defaultUnit ? `(${defaultUnit})` : '';
  const suffixUnit = defaultUnit ? ' ' + defaultUnit : '';

  useEffect(() => {
    form.setFieldValue('dimension', props.reagent?.dimension ?? null);
  }, [props.reagent?.dimension]);

  return (
    <Box style={{ padding: '0 10px 0 0' }}>
      <Paper radius="md" withBorder style={{ padding: '10px' }}>
        <h2>Filtrar</h2>

        <h3>Por nome</h3>

        <SearchBar
          search={props.search}
          onChangeSearch={props.onSearchChange}
          onChangeReagent={props.onReagentChange}
        />

        <h3>Por vencimento</h3>

        <form>
          <Grid>
            <Grid.Col span={{ base: 6 }}>
              <DatePickerInput
                clearable
                valueFormat="DD/MM/YYYY"
                label="A partir de"
                placeholder="Selecione"
                {...form.getInputProps('minDate')}
              ></DatePickerInput>
            </Grid.Col>

            <Grid.Col span={{ base: 6 }}>
              <DatePickerInput
                clearable
                valueFormat="DD/MM/YYYY"
                label="Até"
                placeholder="Selecione"
                {...form.getInputProps('maxDate')}
              ></DatePickerInput>
            </Grid.Col>
          </Grid>

          <h3>Por quantidade</h3>

          <Grid>
            <Grid.Col span={{ base: 12 }}>
              <Select
                label="Dimensão"
                placeholder="Selecione a dimensão"
                data={Object.values(Dimension)}
                disabled={!!props.reagent}
                {...form.getInputProps('dimension')}
              ></Select>
            </Grid.Col>

            <Grid.Col span={{ base: 6 }}>
              <NumberInput
                hideControls
                label="A partir de"
                disabled={!form.values.dimension}
                suffix={suffixUnit}
                placeholder={'Digite a quantidade ' + parenthesizedUnit}
                {...form.getInputProps('minAmount')}
              ></NumberInput>
            </Grid.Col>

            <Grid.Col span={{ base: 6 }}>
              <NumberInput
                hideControls
                label="Até"
                disabled={!form.values.dimension}
                suffix={suffixUnit}
                placeholder={'Digite a quantidade ' + parenthesizedUnit}
                {...form.getInputProps('maxAmount')}
              ></NumberInput>
            </Grid.Col>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
