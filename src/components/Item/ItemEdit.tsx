import { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import {
  Box,
  Button,
  ComboboxItemGroup,
  Flex,
  Grid,
  Group,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { isNotEmpty, useForm } from '@mantine/form';
import { useDisclosure, useToggle } from '@mantine/hooks';
import { Definition } from '@/src/models/definition';
import { useData } from '@/src/providers/DataProvider';
import { Item } from '../../models/item';
import Unit, { Dimension, UnitDimension } from '../../models/unit';
import { toNullableLocalDate, validateDate } from '../../utils/date';
import { DataEdit } from '../Crud/Table/Modal/DataShowEdit';

type ItemModalProps = {
  showMode: boolean;
  selectedItem: Item | null;
  itemModalOpened: boolean;
  onCloseItemModal: () => void;
  onAddItem: (item: Item) => void;
  onEditItem: (selectedItem: Item) => void;
  onBeginShownItemEdit: () => void;
};

export function ItemEdit(props: ItemModalProps) {
  const { definitions, getDefinitionById } = useData();

  const [reagentAddMode, toggleReagentAddMode] = useToggle([false, true]);

  const validateAmount = (value: number): string | null => {
    const countUnits =
      unitSelectOptions.find((group) => group.group == Dimension.COUNT)?.items ?? [];

    return value > 0
      ? !countUnits.includes(itemForm.values.unit) || value % 1 == 0
        ? null
        : 'Precisa ser inteiro'
      : 'Só é possível adicionar quantidade maior que 0';
  };

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (reagentAddMode) {
      ref.current?.focus();
    }
  }, [reagentAddMode]);

  const itemForm = useForm<Item>({
    initialValues: props.selectedItem ?? {
      id: '[NULL]',
      definitionId: '',
      inDate: null,
      expireDate: null,
      amount: 0,
      purity: 0,
      unit: Unit.GRAM,
    },

    transformValues: (values) => ({
      ...values,
      expireDate: toNullableLocalDate(values.expireDate),
    }),

    validate: {
      definitionId: (id) => (id !== '' ? null : 'Inserir uma definição'),
      amount: validateAmount,
      unit: (unit) => (unit != null ? null : 'Inserir unidade de medida'),
      purity: (value) => (value >= 1 && value <= 100 ? null : 'Insira uma pureza entre 1 e 100 %'),
      expireDate: (date: Date | null) => validateDate(date, false),
    },
  });

  const reagentForm = useForm<Definition>({
    initialValues: {
      name: '',
      id: '[NULL]',
      dimension: Dimension.MASS,
      itemsId: [],
    },
    validate: {
      name: isNotEmpty('Dê um nome pro reagente'),
    },
  });

  const dimension = getDefinitionById(itemForm.values.definitionId)?.dimension ?? null;
  const unitSelectOptions: ComboboxItemGroup[] = dimension
    ? [
        {
          group: dimension,
          items: dimension
            ? Object.values(Unit).filter((unit) => UnitDimension[unit] === dimension)
            : [],
        },
      ]
    : [];

  const handleSubmit = (data: Item) => {
    props.onCloseItemModal();

    if (props.selectedItem) props.onEditItem(data);
    else props.onAddItem(data);
    itemForm.reset();
  };

  useEffect(() => {
    if (props.selectedItem) itemForm.setValues(props.selectedItem);
    else itemForm.reset();
  }, [props.selectedItem]);

  // Dar erro se já existir!
  // Quando adicionar, deixar selecionado no select
  // Quando começar a adicionar, já passar o que estava digitando?
  // Pode fazer adicionar qualquer coisa sem querer...
  // Incluir view que permite olhar definições e editar, mas que deve ser pouco usada
  // Voltar pra opção já existente de definição???

  return (
    <Box>
      <Grid>
        {reagentAddMode ? (
          <form>
            <Grid.Col span={{ base: 6 }}>
              <TextInput
                ref={ref}
                label="Nova definição de reagente"
                {...reagentForm.getInputProps('definitionId')}
              ></TextInput>
            </Grid.Col>

            <Grid.Col span={{ base: 6 }}>
              <Select
                allowDeselect={false}
                label="Dimensão"
                {...reagentForm.getInputProps('dimension')}
                data={Object.values(Dimension)}
              ></Select>
            </Grid.Col>
          </form>
        ) : (
          <form>
            <Grid.Col span={{ base: 12 }}>
              <Group justify="space-between" align="end">
                <Select
                  style={{ flex: 1 }}
                  label="Definição"
                  data={
                    definitions?.map((opt) => ({
                      value: opt.id,
                      label: opt.name,
                    })) ?? []
                  }
                  searchable
                  allowDeselect={false}
                  {...itemForm.getInputProps('definitionId')}
                ></Select>
                <Button variant="outline" onClick={() => toggleReagentAddMode()}>
                  +
                </Button>
              </Group>
            </Grid.Col>
          </form>
        )}

        <form>
          <Grid.Col span={{ base: 6 }}>
            <NumberInput
              label="Quantidade"
              placeholder="Quantidade"
              hideControls
              {...itemForm.getInputProps('amount')}
            ></NumberInput>
          </Grid.Col>

          <Grid.Col span={{ base: 6 }}>
            <Select
              allowDeselect={false}
              label="Unidade"
              data={unitSelectOptions}
              disabled={itemForm.values.definitionId === '' || reagentAddMode}
              {...itemForm.getInputProps('unit')}
            ></Select>
          </Grid.Col>

          <Grid.Col span={{ base: 6 }}>
            <NumberInput
              label="Pureza"
              placeholder="Pureza em %"
              hideControls
              suffix=" %"
              {...itemForm.getInputProps('purity')}
            ></NumberInput>
          </Grid.Col>

          <Grid.Col span={{ base: 6 }}>
            <DatePickerInput
              clearable
              valueFormat="DD/MM/YYYY"
              label="Vencimento"
              placeholder="Selecione data"
              {...itemForm.getInputProps('expireDate')}
            ></DatePickerInput>
          </Grid.Col>
        </form>
      </Grid>
      <Box>
        <Group mt="xl" justify="right">
          <Button
            onClick={() => {
              // FIXME: Adicionar reagentForm?
              itemForm.onSubmit(handleSubmit)();
            }}
          >
            {props.selectedItem ? 'Salvar' : 'Adicionar'}
          </Button>

          <Button variant="outline" onClick={props.onCloseItemModal}>
            Cancelar
          </Button>
        </Group>
      </Box>
    </Box>
  );
}
