import { Accordion, Badge, Grid, Group, Paper, Radio, Select, Text, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useFilterOptions } from '@/features/stock-filter/components/filter-options.viewmodel';
import { StockFilter } from '@/features/stock-filter/stock-filter.type';
import { portugueseSearchFilter } from '@/shared/utils/portuguese-search-filter';

type FilterOptionsProps = {
  filter: StockFilter;
  onFilterChange: (filter: StockFilter) => void;
};

function TouchedBadge(props: { text: string; active: boolean }) {
  return (
    <Group gap="xs">
      <Text fw="bold">{props.text}</Text>
      {props.active && <Badge circle size="10px" color="cyan" />}
    </Group>
  );
}

export function FilterOptions(props: FilterOptionsProps) {
  const {
    form,
    dateFieldsDisabled,
    expiredDisabled,
    controlledDisabled,
    controlAgencyDisabled,
    isOutFilterActive,
    isExpireDateFilterActive,
    isControlledFilterActive,
    isBrandFilterActive,
    isLaboratoryFilterActive,
    isSupplierFilterActive,
    controlAgencyOptions,
    brandOptions,
    laboratoryOptions,
    supplierOptions,
    handleControlAgencyChange,
    handleBrandChange,
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
          {/* Saída */}
          <Accordion.Item value="out-status">
            <Accordion.Control>
              <Group>
                <TouchedBadge active={isOutFilterActive} text="Por saída" />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              {/* Range de data */}
              {/* FIXME: Apagar o outro campo quando mudar */}
              <Radio.Group label="Mostrar" defaultValue="all" {...form.getInputProps('outStatus')}>
                <Radio disabled={expiredDisabled} label="Todos" value="all" />
                <Radio disabled={expiredDisabled} label="Apenas com saída" value="is-out" />
                <Radio disabled={expiredDisabled} label="Apenas sem saída" value="not-out" />
              </Radio.Group>
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
              {/* FIXME: Apagar o outro campo quando mudar */}
              <Radio.Group label="Mostrar" defaultValue="all" {...form.getInputProps('expired')}>
                <Radio disabled={expiredDisabled} label="Todos" value="all" />
                <Radio disabled={expiredDisabled} label="Apenas vencidos" value="expired" />
                <Radio disabled={expiredDisabled} label="Apenas não vencidos" value="not-expired" />
              </Radio.Group>
              <Grid mt="md">
                <Grid.Col span={{ base: 6 }}>
                  <DatePickerInput
                    clearable
                    valueFormat="DD/MM/YYYY"
                    label="A partir de"
                    placeholder="Selecione"
                    disabled={dateFieldsDisabled}
                    {...form.getInputProps('minExpire')}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 6 }}>
                  <DatePickerInput
                    clearable
                    valueFormat="DD/MM/YYYY"
                    label="Até"
                    placeholder="Selecione"
                    disabled={dateFieldsDisabled}
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
              <Radio.Group label="Mostrar" defaultValue="all" {...form.getInputProps('controlled')}>
                <Radio disabled={controlledDisabled} label="Todos" value="all" />
                <Radio
                  disabled={controlledDisabled}
                  label="Apenas controlados"
                  value="controlled"
                />
                <Radio
                  disabled={controlledDisabled}
                  label="Apenas não controlados"
                  value="not-controlled"
                />
              </Radio.Group>

              <Select
                clearable
                mt="md"
                label="Orgão de controle"
                placeholder="Escolha o orgão de controle"
                disabled={controlAgencyDisabled}
                data={controlAgencyOptions}
                onChange={handleControlAgencyChange}
                filter={portugueseSearchFilter}
              />
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="byBrand">
            <Accordion.Control>
              <TouchedBadge active={isBrandFilterActive} text="Por marca" />
            </Accordion.Control>
            <Accordion.Panel>
              <Select
                clearable
                mt="md"
                label="Marca"
                placeholder="Escolha a marca"
                data={brandOptions}
                onChange={handleBrandChange}
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
                clearable
                mt="md"
                label="Laboratório"
                placeholder="Escolha o laboratório"
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
                clearable
                mt="md"
                label="Fornecedor"
                placeholder="Escolha o fornecedor"
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
