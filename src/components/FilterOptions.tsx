import { useEffect } from 'react';
import { Box, Grid, Paper, Select } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import ReagentsFilter, { DateField } from '../typings/ReagentsFilter';

type FilterOptionsProps = {
  filter: ReagentsFilter;
  handleChangeFilter: (filter: ReagentsFilter) => void;
};

export default function FilterOptions({ filter, handleChangeFilter }: FilterOptionsProps) {
  const form = useForm<ReagentsFilter>({
    initialValues: filter,

    transformValues: (values) => ({
      ...values,
      minDate: values.minDate ? new Date(values.minDate) : null,
      maxDate: values.maxDate ? new Date(values.maxDate) : null,
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

  return (
    <Box style={{ padding: '0 10px 0 0' }}>
      <Paper radius="md" withBorder style={{ padding: '10px' }}>
        {/*  */}
        <h3>Filtros</h3>

        {/* TODO: usar checkbox e radio select do mantine!!  */}
        <form>
          <Grid>
            {/* <Grid.Col span={{ base: 12 }}>
            <strong>Nome:</strong> {selectedReagent.name}
            </Grid.Col>
            
            <Grid.Col span={{ base: 12 }}>
            <strong>Quantidade:</strong> {formattedAmount(selectedReagent)}
            </Grid.Col>
            
            <Grid.Col span={{ base: 12 }}>
            <strong>Entrada:</strong> {formattedDate(selectedReagent.inDate)}
            </Grid.Col>
            
            <Grid.Col span={{ base: 12 }}>
            <strong>Saída:</strong> {formattedDate(selectedReagent.outDate)}
            </Grid.Col> */}

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
        </form>
      </Paper>
    </Box>
  );
}
