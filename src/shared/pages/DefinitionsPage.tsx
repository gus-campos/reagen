import { Paper, Tabs, Title } from '@mantine/core';
import { BrandsView } from '@/features/brand/brand.view';
import { ControlAgenciesView } from '@/features/control-agency/control-agency.view';
import { LaboratoryView } from '@/features/laboratory/laboratory.view';
import { ReagentsView } from '@/features/reagent/reagent.view';
import { SupplierView } from '@/features/supplier/supplier.view';

export default function DefinitionsPage() {
  return (
    <>
      <Title order={1}>Definições</Title>
      <Paper radius="md" withBorder shadow="sm" my="md" px="md">
        <Tabs defaultValue="reagents" my="lg">
          <Tabs.List defaultValue="reagents">
            <Tabs.Tab value="reagents">Reagentes</Tabs.Tab>
            <Tabs.Tab value="control-agencies">Orgãos de Controle</Tabs.Tab>
            <Tabs.Tab value="brands">Marcas</Tabs.Tab>
            <Tabs.Tab value="laboratories">Laboratórios</Tabs.Tab>
            <Tabs.Tab value="suppliers">Fornecedores</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="reagents">
            <ReagentsView />
          </Tabs.Panel>

          <Tabs.Panel value="control-agencies">
            <ControlAgenciesView />
          </Tabs.Panel>

          <Tabs.Panel value="brands">
            <BrandsView />
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
