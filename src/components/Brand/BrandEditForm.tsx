import { Box, Button, Group, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Brand } from '@/src/models/brand';

type BrandEditFormProps = {
  selectedBrand: Brand;
  onAddBrand: (brand: Brand) => void;
  onEditBrand: (brand: Brand) => void;
  onCancel: () => void;
};

export function BrandEditForm(props: BrandEditFormProps) {
  const sizeForm = useForm<Brand>({
    initialValues: props.selectedBrand ?? {
      name: '',
      id: '',
    },
    validate: {
      name: (value) => (value.trim() === '' ? 'Nome não deve ser vazio' : null),
    },
  });

  return (
    <form onSubmit={sizeForm.onSubmit(props.selectedBrand ? props.onEditBrand : props.onAddBrand)}>
      <Box>
        <TextInput label="Nome" placeholder="Insria o nome" {...sizeForm.getInputProps('name')} />

        <Group my="lg" justify="right">
          <Button variant="outline" onClick={props.onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{props.selectedBrand ? 'Editar' : 'Adicionar'}</Button>
        </Group>
      </Box>
    </form>
  );
}
