import { Box, Button, Group, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { ControlAgency } from '@/src/models/control-agency';

type ControlAgencyEditForm = {
  selectedControlAgency: ControlAgency;
  onAddControlAgency: (brand: ControlAgency) => void;
  onEditControlAgency: (brand: ControlAgency) => void;
  onCancel: () => void;
};

export function ControlAgencyEditForm(props: ControlAgencyEditForm) {
  const controlAgencyForm = useForm<ControlAgency>({
    initialValues: props.selectedControlAgency ?? {
      name: '',
      id: '[NULL]',
    },
    validate: {
      name: (value) => (value.trim() === '' ? 'Nome não deve ser vazio' : null),
    },
  });

  return (
    <form
      onSubmit={controlAgencyForm.onSubmit(
        props.selectedControlAgency ? props.onEditControlAgency : props.onAddControlAgency
      )}
    >
      <Box>
        <TextInput
          label="Nome"
          placeholder="Insria o nome"
          {...controlAgencyForm.getInputProps('name')}
        />
        <Group my="lg" justify="right">
          <Button variant="outline" onClick={props.onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{props.selectedControlAgency ? 'Editar' : 'Adicionar'}</Button>
        </Group>
      </Box>
    </form>
  );
}
