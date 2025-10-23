import { Divider, Grid, Paper, Tabs, Title } from '@mantine/core';
import { ReagentsView } from '../view/ReagentsView';

export function DefinitionsPage() {
  // TODO: Criar docs do firebase, criar views, organizar aqui
  // Accordions???
  return (
    <>
      <Title order={1}>Definições</Title>

      <Tabs defaultValue="reagents" my="lg">
        <Tabs.List defaultValue="reagents">
          <Tabs.Tab value="reagents">Reagentes</Tabs.Tab>
          <Tabs.Tab value="control-agencies">Agências de Controle</Tabs.Tab>
          <Tabs.Tab value="brands">Marcas</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="reagents">
          <Paper radius="md" withBorder shadow="sm" py="xl" px="lg">
            <ReagentsView />
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="control-agencies">
          <Paper radius="md" withBorder shadow="sm" py="xl" px="lg"></Paper>
        </Tabs.Panel>

        <Tabs.Panel value="brands">
          <Paper radius="md" withBorder shadow="sm" py="xl" px="lg"></Paper>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
