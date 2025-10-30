import { Divider, Grid, Paper, Tabs, Title } from '@mantine/core';
import { BrandsView } from '../view/BrandsView';
import { ControlAgenciesView } from '../view/ControlAgencieView';
import { ReagentsView } from '../view/ReagentsView';

export function DefinitionsPage() {
  return (
    <>
      <Title order={1}>Definições</Title>
      <Paper radius="md" withBorder shadow="sm" my="md" px="md">
        <Tabs defaultValue="reagents" my="lg">
          <Tabs.List defaultValue="reagents">
            <Tabs.Tab value="reagents">Reagentes</Tabs.Tab>
            <Tabs.Tab value="control-agencies">Orgãos de Controle</Tabs.Tab>
            <Tabs.Tab value="brands">Marcas</Tabs.Tab>
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
        </Tabs>
      </Paper>
    </>
  );
}
