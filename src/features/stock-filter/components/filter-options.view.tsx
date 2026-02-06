import { Accordion, Badge, Grid, Group, Paper, Radio, Select, Text, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useFilterOptions } from '@/features/stock-filter/components/filter-options.viewmodel';
import { StockFilter } from '@/features/stock-filter/stock-filter.type';
import { portugueseSearchFilter } from '@/shared/utils/portuguese-search-filter';
import classes from './filter-options.module.css';

function TouchedBadge(props: { text: string; active: boolean }) {
  return (
    <Group gap="xs">
      <Text fw="bold" size="14px">
        {props.text}
      </Text>
      {props.active && <Badge circle size="10px" color="cyan" />}
    </Group>
  );
}

type FilterOptionsProps = {
  filter: StockFilter;
  onFilterChange: (filter: StockFilter) => void;
};

export function FilterOptions(props: FilterOptionsProps) {
  const {
    form,
    isInDateFilterActive,
    isOutDateFilterActive,
    isExpireDateFilterActive,
    isControlledFilterActive,
    isFundingSourceFilterActive,
    isLaboratoryFilterActive,
    isSupplierFilterActive,
    controlAgencyOptions,
    fundingSourceOptions,
    laboratoryOptions,
    supplierOptions,
    handleControlAgencyChange,
    handleFundingSourceChange,
    handleLaboratoryChange,
    handleSupplierChange,
  } = useFilterOptions(props);

  return (
    <Paper withBorder radius="sm" py="md" px="md">
      <Title order={4} mb="sm">
        Filtros
      </Title>

      <form>
        <Accordion variant="contained" classNames={classes}>
          {/* Entrada */}
          <Accordion.Item value="in-date">
            <Accordion.Control>
              <Group>
                <TouchedBadge active={isInDateFilterActive} text="Entrada" />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              {/* <InputWrapper label="Filtre por"> */}
              <Paper p="md" withBorder>
                <Grid>
                  <Grid.Col span={{ base: 6 }}>
                    <DatePickerInput
                      clearable
                      valueFormat="DD/MM/YYYY"
                      label="A partir de"
                      placeholder="Selecione"
                      {...form.getInputProps('minInDate')}
                    />
                  </Grid.Col>

                  <Grid.Col span={{ base: 6 }}>
                    <DatePickerInput
                      clearable
                      valueFormat="DD/MM/YYYY"
                      label="Até"
                      placeholder="Selecione"
                      {...form.getInputProps('maxInDate')}
                    />
                  </Grid.Col>
                </Grid>
              </Paper>
              {/* </InputWrapper> */}
            </Accordion.Panel>
          </Accordion.Item>

          {/* Saída */}
          <Accordion.Item value="out-date">
            <Accordion.Control>
              <Group>
                <TouchedBadge active={isOutDateFilterActive} text="Saída" />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Paper p="md" withBorder>
                {/* Range de data */}
                {/* FIXME: Apagar o outro campo quando mudar */}
                <Radio.Group label="Mostrar" {...form.getInputProps('outStatus')}>
                  <Radio label="Todos" value="all" />
                  <Radio label="Com saída" value="is-out" />
                  <Radio label="Sem saída" value="not-out" />
                </Radio.Group>
                <Grid mt="md">
                  <Grid.Col span={{ base: 6 }}>
                    <DatePickerInput
                      clearable
                      valueFormat="DD/MM/YYYY"
                      label="A partir de"
                      placeholder="Selecione"
                      {...form.getInputProps('minOutDate')}
                    />
                  </Grid.Col>

                  <Grid.Col span={{ base: 6 }}>
                    <DatePickerInput
                      clearable
                      valueFormat="DD/MM/YYYY"
                      label="Até"
                      placeholder="Selecione"
                      {...form.getInputProps('maxOutDate')}
                    />
                  </Grid.Col>
                </Grid>
              </Paper>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Vencimento */}
          <Accordion.Item value="expire-date">
            <Accordion.Control>
              <Group>
                <TouchedBadge active={isExpireDateFilterActive} text="Vencimento" />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Paper p="md" withBorder>
                {/* Range de data */}
                <Radio.Group label="Mostrar" {...form.getInputProps('expired')}>
                  <Radio label="Todos" value="all" />
                  <Radio label="vencidos" value="expired" />
                  <Radio label="não vencidos" value="not-expired" />
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
              </Paper>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="controlled">
            <Accordion.Control>
              <TouchedBadge active={isControlledFilterActive} text="Controle" />
            </Accordion.Control>
            <Accordion.Panel>
              <Paper p="md" withBorder>
                <Radio.Group label="Mostrar" {...form.getInputProps('controlled')}>
                  <Radio label="Todos" value="all" />
                  <Radio label="Controlados" value="controlled" />
                  <Radio label="Não controlados" value="not-controlled" />
                </Radio.Group>

                <Select
                  searchable
                  clearable
                  mt="md"
                  label="Orgão de controle"
                  placeholder="Escolha o orgão de controle"
                  value={form.values.controlAgencyId}
                  data={controlAgencyOptions}
                  onChange={handleControlAgencyChange}
                  filter={portugueseSearchFilter}
                />
              </Paper>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="byFundingSource">
            <Accordion.Control>
              <TouchedBadge active={isFundingSourceFilterActive} text="Adquirente" />
            </Accordion.Control>
            <Accordion.Panel>
              <Paper p="md" withBorder>
                <Radio.Group label="Mostrar" {...form.getInputProps('fundingScope')}>
                  <Radio label="Todos" value="all" />
                  <Radio label="Interno" value="internal" />
                  <Radio label="Externo" value="external" />
                </Radio.Group>
                <Select
                  searchable
                  clearable
                  mt="md"
                  label="Adquirente"
                  placeholder="Escolha o adquirente"
                  value={form.values.fundingSourceId}
                  data={fundingSourceOptions}
                  onChange={handleFundingSourceChange}
                  filter={portugueseSearchFilter}
                />
              </Paper>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="byLaboratory">
            <Accordion.Control>
              <TouchedBadge active={isLaboratoryFilterActive} text="Laboratório" />
            </Accordion.Control>
            <Accordion.Panel>
              <Paper p="md" withBorder>
                <Select
                  searchable
                  clearable
                  label="Laboratório"
                  placeholder="Escolha o laboratório"
                  value={form.values.laboratoryId}
                  data={laboratoryOptions}
                  onChange={handleLaboratoryChange}
                  filter={portugueseSearchFilter}
                />
              </Paper>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="bySupplier">
            <Accordion.Control>
              <TouchedBadge active={isSupplierFilterActive} text="Fornecedor" />
            </Accordion.Control>
            <Accordion.Panel>
              <Paper p="md" withBorder>
                <Select
                  searchable
                  clearable
                  label="Fornecedor"
                  placeholder="Escolha o fornecedor"
                  value={form.values.supplierId}
                  data={supplierOptions}
                  onChange={handleSupplierChange}
                  filter={portugueseSearchFilter}
                />
              </Paper>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </form>
    </Paper>
  );
}
