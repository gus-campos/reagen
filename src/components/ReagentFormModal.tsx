import { useEffect } from 'react';
import { Button, Grid, Group, Modal, NumberInput, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import ReagentData from '../typings/ReagentData';
import Unit, { UnitLabels } from '../typings/Unit';

const units = [
  {
    group: 'Massa',
    items: [
      { value: Unit.GRAMS, label: UnitLabels[Unit.GRAMS] },
      { value: Unit.KILOGRAMS, label: UnitLabels[Unit.KILOGRAMS] },
    ],
  },
  {
    group: 'Volume',
    items: [
      { value: Unit.MILILITERS, label: UnitLabels[Unit.MILILITERS] },
      { value: Unit.LITERS, label: UnitLabels[Unit.LITERS] },
    ],
  },
  {
    group: 'Outros',
    items: [{ value: Unit.UNITS, label: UnitLabels[Unit.UNITS] }],
  },
];

// items é de fato o item, e não a label. Como separar?

type ReagentFormModalProps = {
  editedReagent: ReagentData | null;
  setReagentsData: (reagententsData: ReagentData[]) => void;
  reagentModalOpened: boolean;
  closeReagentModal: () => void;
  handleAddReagent: (reagent: ReagentData) => void;
  handleEditReagent: (editedReagent: ReagentData) => void;
};

export default function ReagentFormModal({
  editedReagent,
  reagentModalOpened,
  closeReagentModal,
  handleAddReagent,
  handleEditReagent,
}: ReagentFormModalProps) {
  const handleSubmit = (reagentData: ReagentData) => {
    if (editedReagent) handleEditReagent(reagentData);
    else handleAddReagent(reagentData);

    closeReagentModal();
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
      unit: (unit) => (unit != null ? null : 'Inserir unidade de medida'),
    },
  });

  // TODO: É possível substituir?
  useEffect(() => {
    if (editedReagent) form.setValues(editedReagent);
    else form.reset();
  }, [editedReagent]);

  return (
    <Modal title={'Adicionar reagentente'} opened={reagentModalOpened} onClose={closeReagentModal}>
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
            {/* TODO: Não permitir descelecionar */}
            <Select label="Unidade" {...form.getInputProps('unit')} data={units}></Select>
          </Grid.Col>
        </Grid>

        <Group mt="xl" justify="right">
          <Button type="submit">{editedReagent ? 'Editar' : 'Adicionar'}</Button>
          <Button variant="outline" onClick={closeReagentModal}>
            Cancelar
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
