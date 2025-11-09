import { Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

type AccountInfo = {
  email: string;
  password: string;
};

type AccountInfoFormProps = {
  isSignUp?: boolean;
};

export function AccountInfoForm(props: AccountInfoFormProps) {
  const form = useForm<AccountInfo>({
    initialValues: {
      email: '',
      password: '',
    },
  });

  return (
    <Stack>
      <TextInput label="Email" placeholder="Insira o email" {...form.getInputProps('email')} />
      <TextInput
        label="Senha"
        placeholder="Insira a senha"
        type="password"
        {...form.getInputProps('password')}
      />
    </Stack>
  );
}
