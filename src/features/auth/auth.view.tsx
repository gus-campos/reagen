import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAuth } from '@/shared/hooks/useAuth';

type AccountInfo = {
  email: string;
  password: string;
};

type AccountInfoFormProps = {
  isSignUp?: boolean;
};

export function AccountInfoForm(_props: AccountInfoFormProps) {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<AccountInfo>({
    initialValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (accountInfo: AccountInfo) => {
    try {
      const user = await login(accountInfo.email, accountInfo.password);
      if (user) router.push('/estoque');
    } catch (error) {
      setError('Usuário ou senha inválido. Tente novamente.');
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput label="Email" placeholder="Insira o email" {...form.getInputProps('email')} />
        <TextInput
          label="Senha"
          placeholder="Insira a senha"
          type="password"
          {...form.getInputProps('password')}
        />
        {error && <Text c="red">{error}</Text>}
        <Button type="submit">Entrar</Button>
      </Stack>
    </form>
  );
}
