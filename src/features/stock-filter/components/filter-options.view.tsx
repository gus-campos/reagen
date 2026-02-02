import { Accordion, Badge, Grid, Group, Paper, Radio, Select, Text, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useFilterOptions } from '@/features/stock-filter/components/filter-options.viewmodel';
import { StockFilter } from '@/features/stock-filter/stock-filter.type';
import { portugueseSearchFilter } from '@/shared/utils/portuguese-search-filter';

function TouchedBadge(props: { text: string; active: boolean }) {
  return (
    <Group gap="xs">
      <Text fw="bold">{props.text}</Text>
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
        <Accordion variant="default" chevronPosition="left">
          {/* Entrada */}
          <Accordion.Item value="in-date">
            <Accordion.Control>
              <Group>
                <TouchedBadge active={isInDateFilterActive} text="Por entrada" />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Grid mt="md">
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
            </Accordion.Panel>
          </Accordion.Item>

          {/* Saída */}
          <Accordion.Item value="out-date">
            <Accordion.Control>
              <Group>
                <TouchedBadge active={isOutDateFilterActive} text="Por saída" />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              {/* Range de data */}
              {/* FIXME: Apagar o outro campo quando mudar */}
              <Radio.Group label="Mostrar" {...form.getInputProps('outStatus')}>
                <Radio label="Todos" value="all" />
                <Radio label="Apenas com saída" value="is-out" />
                <Radio label="Apenas sem saída" value="not-out" />
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
            </Accordion.Panel>
          </Accordion.Item>

          {/* Vencimento */}
          <Accordion.Item value="expire-date">
            <Accordion.Control>
              <Group>
                <TouchedBadge active={isExpireDateFilterActive} text="Por vencimento" />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              {/* Range de data */}
              <Radio.Group label="Mostrar" {...form.getInputProps('expired')}>
                <Radio label="Todos" value="all" />
                <Radio label="Apenas vencidos" value="expired" />
                <Radio label="Apenas não vencidos" value="not-expired" />
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
              <TouchedBadge active={isControlledFilterActive} text="Por controle" />
            </Accordion.Control>
            <Accordion.Panel>
              <Radio.Group label="Mostrar" {...form.getInputProps('controlled')}>
                <Radio label="Todos" value="all" />
                <Radio label="Apenas controlados" value="controlled" />
                <Radio label="Apenas não controlados" value="not-controlled" />
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
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="byFundingSource">
            <Accordion.Control>
              <TouchedBadge active={isFundingSourceFilterActive} text="Por adquirente" />
            </Accordion.Control>
            <Accordion.Panel>
              <Radio.Group label="Mostrar" {...form.getInputProps('fundingScope')}>
                <Radio label="Todos" value="all" />
                <Radio label="Apenas interno" value="internal" />
                <Radio label="Apenas externo" value="external" />
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
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="byLaboratory">
            <Accordion.Control>
              <TouchedBadge active={isLaboratoryFilterActive} text="Por laboratório" />
            </Accordion.Control>
            <Accordion.Panel>
              <Select
                searchable
                clearable
                mt="md"
                label="Laboratório"
                placeholder="Escolha o laboratório"
                value={form.values.laboratoryId}
                data={laboratoryOptions}
                onChange={handleLaboratoryChange}
                filter={portugueseSearchFilter}
              />
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="bySupplier">
            <Accordion.Control>
              <TouchedBadge active={isSupplierFilterActive} text="Por fornecedor" />
            </Accordion.Control>
            <Accordion.Panel>
              <Select
                searchable
                clearable
                mt="md"
                label="Fornecedor"
                placeholder="Escolha o fornecedor"
                value={form.values.supplierId}
                data={supplierOptions}
                onChange={handleSupplierChange}
                filter={portugueseSearchFilter}
              />
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </form>
    </Paper>
  );
}
