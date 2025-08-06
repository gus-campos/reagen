import { useEffect } from 'react';
import { Box, Divider, Grid, NumberInput, Paper, Select } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { Definition } from '@/src/models/definition';
import ReagentsFilter from '@/src/models/reagents-filter';
import { Dimension, DimensionDefaultUnit } from '@/src/models/unit';
import { toNullableLocalDate } from '@/src/utils/date';
import { SearchBar } from './SearchBar';

type FilterOptionsProps = {
  search: string;
  filter: ReagentsFilter;
  onSearchChange: (search: string) => void;
  onFilterChange: (filter: ReagentsFilter) => void;
  onDefinitionChange: (definition: Definition | null) => void;
  definition: Definition | null;
};

export function FilterOptions(props: FilterOptionsProps) {
  const form = useForm<ReagentsFilter>({
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
    form.setFieldValue('dimension', props.definition?.dimension ?? null);
  }, [props.definition?.dimension]);

  return (
    <Box style={{ padding: '0 10px 0 0' }}>
      <Paper radius="md" withBorder style={{ padding: '10px' }}>
        <h2>Filtrar</h2>

        <h3>Por nome</h3>

        <SearchBar
          search={props.search}
          onChangeSearch={props.onSearchChange}
          onChangeDefinition={props.onDefinitionChange}
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
                disabled={!!props.definition}
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
