import { Group, Paper, Title } from '@mantine/core';
import { AccountInfoForm } from '@/src/features/autenticar/views/AccountInfoForm';

export default function Auth() {
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
