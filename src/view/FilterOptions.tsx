import { useEffect } from 'react';
import { Box, Divider, Grid, NumberInput, Paper, Select } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { SearchBar } from '../components/SearchBar';
import { DateField, ReagentsFilter } from '../typings/reagents-filter';
import { Dimension, DimensionDefaultUnit } from '../typings/unit';
import { toNullableLocalDate } from '../utils/date';

type FilterOptionsProps = {
  search: string;
  filter: ReagentsFilter;
  onSearchChange: (search: string) => void;
  onFilterChange: (filter: ReagentsFilter) => void;
};

export function FilterOptions({
  search,
  filter,
  onSearchChange,
  onFilterChange,
}: FilterOptionsProps) {
  const form = useForm<ReagentsFilter>({
    initialValues: filter,

    transformValues: (values) => ({
      ...values,
      minDate: toNullableLocalDate(values.minDate),
      maxDate: toNullableLocalDate(values.maxDate),
    }),
  });

  // Armazenar UTC, converter local, ver como mantine lida com isso, definir locale?

  useEffect(() => {
    const timer = setTimeout(() => {
      if (form.isTouched()) {
        onFilterChange(form.getTransformedValues());
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.values]);

  const defaultUnit = form.values.dimension ? DimensionDefaultUnit[form.values.dimension] : null;

  const parenthesizedUnit = defaultUnit ? `(${defaultUnit})` : '';
  const suffixUnit = defaultUnit ? ' ' + defaultUnit : '';

  return (
    <Box style={{ padding: '0 10px 0 0' }}>
      <Paper radius="md" withBorder style={{ padding: '10px' }}>
        <h3>Busca</h3>

        <SearchBar search={search} setSearch={onSearchChange} />

        <Divider my="md" />

        <h3>Filtros</h3>

        <form>
          <Divider my="sm" label="Por data" />

          <Grid>
            <Grid.Col span={{ base: 12 }}>
              <Select
                label="Campo de data"
                placeholder="Selecione um campo de data"
                data={Object.values(DateField)}
                {...form.getInputProps('dateField')}
              ></Select>
            </Grid.Col>

            <Grid.Col span={{ base: 6 }}>
              <DatePickerInput
                clearable
                disabled={!form.values.dateField}
                valueFormat="DD/MM/YYYY"
                label="A partir de"
                placeholder="Selecione"
                {...form.getInputProps('minDate')}
              ></DatePickerInput>
            </Grid.Col>

            <Grid.Col span={{ base: 6 }}>
              <DatePickerInput
                clearable
                disabled={!form.values.dateField}
                valueFormat="DD/MM/YYYY"
                label="Até"
                placeholder="Selecione"
                {...form.getInputProps('maxDate')}
              ></DatePickerInput>
            </Grid.Col>
          </Grid>

          <Divider my="sm" label="Por quantidade" />

          <Grid>
            <Grid.Col span={{ base: 12 }}>
              <Select
                label="Dimensão"
                placeholder="Selecione a dimensão"
                data={Object.values(Dimension)}
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
