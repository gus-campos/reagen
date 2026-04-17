import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Button, Stack, Text, TextInput } from '@mantine/core';
import { useAppAuth } from '@/providers/auth.provider';

type AccountInfo = {
  email: string;
  password: string;
};

const loginFormSchema = z.object({
  email: z.email('Email inválido.'),
  password: z.string().nonempty('Insira sua senha.'),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export function AccountInfoForm() {
  const { login } = useAppAuth();
  const [mainError, setMainError] = useState<string | null>(null);
  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors },
    clearErrors,
    register,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });

  const handleLoginFormSubmit = async (accountInfo: AccountInfo) => {
    try {
      const user = await login(accountInfo.email, accountInfo.password);
      if (user) router.push('/estoque');
    } catch (error) {
      setMainError('Usuário ou senha inválido. Tente novamente.');
      clearErrors();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLoginFormSubmit)}>
      <Stack>
        <TextInput
          label="Email"
          placeholder="Insira o email"
          error={errors.email?.message}
          {...register('email')}
        />
        <TextInput
          label="Senha"
          placeholder="Insira a senha"
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />
        {mainError && <Text c="red">{mainError}</Text>}
        <Button type="submit">Entrar</Button>
      </Stack>
    </form>
  );
}
