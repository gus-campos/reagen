import { Box, Grid, Paper } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import ReagentsFilter from '../typings/ReagentsFilter';

export default function FilterOptions() {
  const form = useForm<ReagentsFilter>({
    initialValues: {
      expired: null,
      dateFieldFiltered: null,
      minDate: null,
      maxDate: null,
      dimension: null,
      amount: null,
    },
  });

  return (
    <Box style={{ padding: '0 10px 0 0' }}>
      <Paper radius="md" withBorder style={{ padding: '10px' }}>
        {/*  */}
        <h3>Filtros</h3>

        {/* TODO: usar checkbox e radio select do mantine!!  */}

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
      </Paper>
    </Box>
  );
}
