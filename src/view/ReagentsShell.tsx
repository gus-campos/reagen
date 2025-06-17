'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { IconHome, IconTable, IconTestPipe } from '@tabler/icons-react';
import { AppShell, Burger, Group, Menu, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

type ReagentShellProps = {
  children: ReactNode[];
};

export default function ReagentShell({ children }: ReagentShellProps) {
  const [opened, { toggle }] = useDisclosure();
  const router = useRouter();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 200, breakpoint: 'sm', collapsed: { desktop: !opened, mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} size="sm" />
          <IconTestPipe size={28} />
          <Text size="xl">Controle de Reagentes</Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <strong>Menu</strong>
        <Menu>
          <Menu.Item
            onClick={() => {
              toggle();
              router.push('/');
            }}
          >
            <Group>
              <IconHome size={20} />
              <Text size="md">Início</Text>
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
        </Menu>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
