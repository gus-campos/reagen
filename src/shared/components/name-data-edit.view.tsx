import { Box, Button, Group, TextInput } from '@mantine/core';
import { useNameDataEdit } from '@/shared/components/name-data-edit.viewmodel';
import { NameData } from '@/shared/types/name-data';

type NameDataEditProps<T extends NameData> = {
  selectedData: T;
  onAddData: (data: T) => void;
  onEditData: (data: T) => void;
  onCancel: () => void;
};

export function NameDataEdit<T extends NameData>(props: NameDataEditProps<T>) {
  const { dataForm, submitButtonText, handleSubmit } = useNameDataEdit(props);

  return (
    <form onSubmit={dataForm.onSubmit(handleSubmit)}>
      <Box>
        <TextInput label="Nome" placeholder="Insira o nome" {...dataForm.getInputProps('name')} />

        <Group my="lg" justify="right">
          <Button variant="outline" onClick={props.onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{submitButtonText}</Button>
        </Group>
      </Box>
    </form>
  );
}
