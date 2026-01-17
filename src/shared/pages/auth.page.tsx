// src/features/auth/LoginPage.tsx

import { redirect } from 'next/navigation';
import { Group, Paper, Title } from '@mantine/core';
import { AccountInfoForm } from '@/features/auth/auth.view';
import { useAuth } from '@/shared/hooks/useAuth';

export function Auth() {
  const { user } = useAuth();

  if (user) redirect('/estoque');

  return (
    <Group justify="center" align="center" style={{ height: '100vh' }}>
      <Paper withBorder radius="sm" p="xl" miw="400px">
        <Group justify="center" align="center">
          <Title order={3} mb="sm">
            Entrar
          </Title>
        </Group>
        <AccountInfoForm />
      </Paper>
    </Group>
  );
}
