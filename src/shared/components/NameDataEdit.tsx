import { Box, Button, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { NameData } from '@/shared/types/name-data';

type NameDataEditProps<T extends NameData> = {
  selectedData: T;
  onAddData: (data: T) => void;
  onEditData: (data: T) => void;
  onCancel: () => void;
};

export function NameDataEdit<T extends NameData>(props: NameDataEditProps<T>) {
  const dataForm = useForm<NameData>({
    initialValues: {
      name: props.selectedData?.name ?? '',
      id: props.selectedData?.id ?? '',
    },
    validate: {
      name: (value: string) => (value.trim() === '' ? 'Nome não deve ser vazio' : null),
    },
  });

  const handleSubmit = (values: NameData) => {
    const formData = values as unknown as T;
    if (props.selectedData) {
      props.onEditData(formData);
    } else {
      props.onAddData(formData);
    }
  };

  return (
    <form onSubmit={dataForm.onSubmit(handleSubmit)}>
      <Box>
        <TextInput label="Nome" placeholder="Insira o nome" {...dataForm.getInputProps('name')} />

        <Group my="lg" justify="right">
          <Button variant="outline" onClick={props.onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{props.selectedData ? 'Editar' : 'Adicionar'}</Button>
        </Group>
      </Box>
    </form>
  );
}
