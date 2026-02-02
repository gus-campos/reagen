import { Paper, Tabs, Title } from '@mantine/core';
import { FundingSourceView } from '@/features/named-option/brand/brand.view';
import { ControlAgenciesView } from '@/features/named-option/control-agency/control-agency.view';
import { LaboratoryView } from '@/features/named-option/laboratory/laboratory.view';
import { SupplierView } from '@/features/named-option/supplier/supplier.view';
import { ReagentsView } from '@/features/reagent/reagent.view';

export default function DefinitionsPage() {
  return (
    <>
      <Title order={1}>Cadastros</Title>
      <Paper radius="md" withBorder shadow="sm" my="md" px="md">
        <Tabs defaultValue="reagents" my="lg">
          <Tabs.List defaultValue="reagents">
            <Tabs.Tab value="reagents">Reagente</Tabs.Tab>
            <Tabs.Tab value="control-agencies">Orgão de Controle</Tabs.Tab>
            <Tabs.Tab value="brands">Marcas</Tabs.Tab>
            <Tabs.Tab value="laboratories">Laboratório</Tabs.Tab>
            <Tabs.Tab value="suppliers">Fornecedore</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="reagents">
            <ReagentsView />
          </Tabs.Panel>

          <Tabs.Panel value="control-agencies">
            <ControlAgenciesView />
          </Tabs.Panel>

          <Tabs.Panel value="brands">
            <FundingSourceView />
          </Tabs.Panel>

          <Tabs.Panel value="laboratories">
            <LaboratoryView />
          </Tabs.Panel>

          <Tabs.Panel value="suppliers">
            <SupplierView />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </>
  );
}
