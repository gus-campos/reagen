import { Button, Grid, Group, Modal, NumberInput, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import ReagentData from '../typings/ReagentData';
import Unit from '../typings/Unit';

const units = [
  {
    group: 'Massa',
    items: [Unit.GRAMS, Unit.KILOGRAMS],
  },
  {
    group: 'Volume',
    items: [Unit.LITERS],
  },
  {
    group: 'Outros',
    items: [Unit.UNITS],
  },
];

type AddReagentModalProps = {
  reagententsData: ReagentData[];
  setReagentsData: (reagententsData: ReagentData[]) => void;
  addModalOpened: boolean;
  closeAddModal: () => void;
  handleAddReagent: (reagent: ReagentData) => void;
};

export default function AddReagentModal({
  addModalOpened,
  closeAddModal,
  handleAddReagent,
}: AddReagentModalProps) {
  const handleSubmit = (reagentData: ReagentData) => {
    handleAddReagent(reagentData);
    closeAddModal();
    form.reset();
  };

  const validateAmount = (value: number) => {
    return value > 0
      ? form.values.unit != Unit.UNITS || value % 1 == 0
        ? null
        : 'Precisa ser inteiro'
      : 'Só é possível adicionar quantidade maior que 0';
  };

  const form = useForm<ReagentData>({
    initialValues: {
      id: null,
      name: '',
      unit: Unit.GRAMS,
      amount: 0,
    },

    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'O nome não pode estar vazio'),
      amount: validateAmount,
    },
  });

  return (
    <Modal title={'Adicionar reagentente'} opened={addModalOpened} onClose={closeAddModal}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid>
          <Grid.Col span={{ base: 12 }}>
            <TextInput label="Nome" {...form.getInputProps('name')}></TextInput>
          </Grid.Col>

          <Grid.Col span={{ base: 6 }}>
            <NumberInput
              label="Quantidade"
              hideControls
              {...form.getInputProps('amount')}
            ></NumberInput>
          </Grid.Col>

          <Grid.Col span={{ base: 6 }}>
            <Select label="Unidade" {...form.getInputProps('unit')} data={units}></Select>
          </Grid.Col>
        </Grid>

        <Group mt="xl" justify="right">
          <Button type="submit">Adicionar</Button>

          <Button variant="outline" onClick={closeAddModal}>
            Cancelar
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
