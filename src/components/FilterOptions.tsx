import { useEffect } from 'react';
import { Box, Divider, Grid, NumberInput, Paper, Select } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import ReagentsFilter, { DateField } from '../typings/ReagentsFilter';
import { Dimension, DimensionDefaultUnit } from '../typings/Unit';
import { toNullableLocalDate } from '../utils/date';
import SearchBar from './SearchBar';

type FilterOptionsProps = {
  search: string;
  handleChangeSearch: (search: string) => void;
  filter: ReagentsFilter;
  handleChangeFilter: (filter: ReagentsFilter) => void;
};

export default function FilterOptions({
  search,
  handleChangeSearch,
  filter,
  handleChangeFilter,
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
        handleChangeFilter(form.getTransformedValues());
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

        <SearchBar search={search} setSearch={handleChangeSearch} />

        <Divider my="md" />

        <h3>Filtros</h3>

        {/* TODO: usar checkbox e radio select do mantine!!  */}
        <form>
          <Divider my="md" label="Data" />

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

          <Divider my="md" label="Quantidade" />

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
