'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { IconHome, IconTable, IconTestPipe } from '@tabler/icons-react';
import { AppShell, Burger, Button, Group, Menu, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '@/shared/hooks/useAuth';

type ReagenShellProps = {
  children: ReactNode[];
};

export function ReagenShell(props: ReagenShellProps) {
  const [opened, { toggle }] = useDisclosure();
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 200, breakpoint: 'sm', collapsed: { desktop: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} size="sm" />
          <IconTestPipe size={28} />
          <Text size="xl">Reagen - Controle de Reagentes</Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack style={{ height: '100%' }}>
          <strong>Menu</strong>
          <Menu>
            <Menu.Item
              onClick={() => {
                toggle();
                router.push('/dashboard');
              }}
            >
              <Group>
                <IconHome size={20} />
                <Text size="md">Dashboard</Text>
              </Group>
            </Menu.Item>

            <Menu.Item
              onClick={() => {
                toggle();
                router.push('/estoque');
              }}
            >
              <Group>
                <IconTable size={20} />
                <Text size="md">Estoque</Text>
              </Group>
            </Menu.Item>

            <Menu.Item
              onClick={() => {
                toggle();
                router.push('/definicoes');
              }}
            >
              <Group>
                <IconTable size={20} />
                <Text size="md">Definições</Text>
              </Group>
            </Menu.Item>

            <Menu.Item
              onClick={() => {
                toggle();
                router.push('/relatorio');
              }}
            >
              <Group>
                <IconTable size={20} />
                <Text size="md">Relatório</Text>
              </Group>
            </Menu.Item>
          </Menu>
          <Button style={{ marginTop: 'auto', borderRadius: '999px' }} onClick={logout}>
            Sair
          </Button>
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>{props.children}</AppShell.Main>
    </AppShell>
  );
}
