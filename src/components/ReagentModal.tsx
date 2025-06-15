import { useEffect } from 'react';
import {
  Box,
  Button,
  ComboboxItemGroup,
  Grid,
  Group,
  Modal,
  NumberInput,
  Select,
  TextInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import Reagent from '../typings/Reagent';
import Unit, { Dimension, UnitDimension } from '../typings/Unit';
import { toNullableLocalDate, validateDate } from '../utils/date';
import formattedAmount from '../utils/formattedAmount';
import formattedDate from '../utils/formattedDate';

// Criando opções agrupadas de unidades de medida
const unitSelectOptions: ComboboxItemGroup[] = [];

for (const dimension of Object.values(Dimension)) {
  const group: ComboboxItemGroup = {
    group: dimension,
    items: [],
  };

  for (const unit of Object.values(Unit)) {
    if (UnitDimension[unit] == dimension) {
      group.items.push(unit);
    }
  }

  unitSelectOptions.push(group);
}

type ReagentModalProps = {
  onShowMode: boolean;
  selectedReagent: Reagent | null;
  reagentModalOpened: boolean;
  closeReagentModal: () => void;
  handleAddReagent: (reagent: Reagent) => void;
  handleEditReagent: (selectedReagent: Reagent) => void;
  beginShownReagentEdit: () => void;
};

export default function ReagentModal({
  onShowMode,
  selectedReagent,
  reagentModalOpened,
  closeReagentModal,
  handleAddReagent,
  handleEditReagent,
  beginShownReagentEdit,
}: ReagentModalProps) {
  const handleSubmit = (reagent: Reagent) => {
    closeReagentModal();

    if (selectedReagent) handleEditReagent(reagent);
    else handleAddReagent(reagent);
    form.reset();
  };

  const validateAmount = (value: number): string | null => {
    const countUnits =
      unitSelectOptions.find((group) => group.group == Dimension.COUNT)?.items ?? [];

    return value > 0
      ? !countUnits.includes(form.values.unit) || value % 1 == 0
        ? null
        : 'Precisa ser inteiro'
      : 'Só é possível adicionar quantidade maior que 0';
  };

  // Só armazenar datas inteiras sem horas

  const form = useForm<Reagent>({
    initialValues: {
      id: null,
      inDate: null,
      outDate: null,
      expireDate: null,
      name: '',
      amount: 0,
      unit: Unit.GRAM,
    },

    transformValues: (values) => ({
      ...values,
      inDate: toNullableLocalDate(values.inDate),
      outDate: toNullableLocalDate(values.outDate),
      expireDate: toNullableLocalDate(values.expireDate),
    }),

    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'O nome não pode estar vazio'),
      amount: validateAmount,
      unit: (unit) => (unit != null ? null : 'Inserir unidade de medida'),
      inDate: (date: Date | null) => validateDate(date),
      outDate: (date: Date | null) => validateDate(date, true),
      expireDate: (date: Date | null) => validateDate(date, true),
    },
  });

  useEffect(() => {
    if (selectedReagent) form.setValues(selectedReagent);
    else form.reset();
  }, [selectedReagent]);

  return (
    <Modal
      title={
        <strong>
          {onShowMode
            ? 'Ficha reagente'
            : selectedReagent
              ? 'Editar reagente'
              : 'Adicionar reagentente'}
        </strong>
      }
      opened={reagentModalOpened}
      onClose={closeReagentModal}
    >
      {onShowMode && selectedReagent ? (
        <Box
          style={{
            padding: '10px',
          }}
        >
          <Grid>
            <Grid.Col span={{ base: 12 }}>
              <strong>Nome:</strong> {selectedReagent.name}
            </Grid.Col>

            <Grid.Col span={{ base: 12 }}>
              <strong>Quantidade:</strong> {formattedAmount(selectedReagent)}
            </Grid.Col>

            <Grid.Col span={{ base: 12 }}>
              <strong>Entrada:</strong> {formattedDate(selectedReagent.inDate)}
            </Grid.Col>

            <Grid.Col span={{ base: 12 }}>
              <strong>Saída:</strong> {formattedDate(selectedReagent.outDate)}
            </Grid.Col>

            <Grid.Col span={{ base: 12 }}>
              <strong>Vencimento:</strong> {formattedDate(selectedReagent.expireDate)}
            </Grid.Col>
          </Grid>
        </Box>
      ) : (
        <form>
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
              <Select
                allowDeselect={false}
                label="Unidade"
                {...form.getInputProps('unit')}
                data={unitSelectOptions}
              ></Select>
            </Grid.Col>

            <Grid.Col span={{ base: 4 }}>
              <DatePickerInput
                clearable
                valueFormat="DD/MM/YYYY"
                label="Entrada"
                placeholder="Selecione data"
                {...form.getInputProps('inDate')}
              ></DatePickerInput>
            </Grid.Col>

            <Grid.Col span={{ base: 4 }}>
              <DatePickerInput
                clearable
                valueFormat="DD/MM/YYYY"
                label="Saída"
                placeholder="Selecione data"
                {...form.getInputProps('outDate')}
              ></DatePickerInput>
            </Grid.Col>

            <Grid.Col span={{ base: 4 }}>
              <DatePickerInput
                clearable
                valueFormat="DD/MM/YYYY"
                label="Vencimento"
                placeholder="Selecione data"
                {...form.getInputProps('expireDate')}
              ></DatePickerInput>
            </Grid.Col>
          </Grid>
        </form>
      )}
      <Group mt="xl" justify="right">
        {onShowMode ? (
          <Button onClick={beginShownReagentEdit}>Editar</Button>
        ) : (
          <Button onClick={() => form.onSubmit(handleSubmit)()}>
            {selectedReagent ? 'Salvar' : 'Adicionar'}
          </Button>
        )}
        <Button variant="outline" onClick={closeReagentModal}>
          Cancelar
        </Button>
      </Group>
    </Modal>
  );
}
