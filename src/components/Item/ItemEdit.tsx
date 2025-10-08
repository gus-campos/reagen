import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  ComboboxItemGroup,
  Grid,
  Group,
  NumberInput,
  Select,
  Text,
  TextInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useToggle } from '@mantine/hooks';
import { Reagent } from '@/src/models/reagent';
import { useData } from '@/src/providers/DataProvider';
import { Item } from '../../models/item';
import Unit, { Dimension, DimensionDefaultUnit, UnitDimension } from '../../models/unit';
import { toNullableLocalDate, validateDate } from '../../utils/date';

type ItemModalProps = {
  showMode: boolean;
  selectedItem: Item | null;
  itemModalOpened: boolean;
  onCloseItemModal: () => void;
  onAddItem: (item: Item) => void;
  onEditItem: (selectedItem: Item) => void;
  onBeginShownItemEdit: () => void;
  onAddReagent: (reagent: Reagent) => void;
};

export function ItemEdit(props: ItemModalProps) {
  const { reagents, getReagentById } = useData();

  const [reagentAddMode, toggleReagentAddMode] = useToggle([false, true]);
  const [createdReagentName, setCreatedReagentName] = useState('');

  const validateAmount = (value: number): string | null => {
    const countUnits =
      unitSelectOptions.find((group) => group.group == Dimension.COUNT)?.items ?? [];

    return value > 0
      ? !countUnits.includes(itemForm.values.unit) || value % 1 == 0
        ? null
        : 'Precisa ser inteiro'
      : 'Só é possível adicionar quantidade maior que 0';
  };

  const inputFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (reagentAddMode) {
      inputFocusRef.current?.focus();
    }
  }, [reagentAddMode]);

  const itemForm = useForm<Item>({
    initialValues: props.selectedItem ?? {
      id: '[NULL]',
      reagentId: '[NULL]',
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
      reagentId: (id) => (id !== '[NULL]' || reagentAddMode ? null : 'Inserir um reagente'),
      amount: validateAmount,
      unit: (unit) => (unit ? null : 'Inserir unidade de medida'),
      purity: (value) => (value >= 1 && value <= 100 ? null : 'Insira uma pureza entre 1 e 100 %'),
      expireDate: (date: Date | null) => validateDate(date, false),
    },
  });

  const reagentForm = useForm<Reagent>({
    initialValues: {
      name: '',
      id: '[NULL]',
      dimension: Dimension.MASS,
      itemsId: [],
    },
    validate: {
      name: (value) => (value !== '' ? null : 'Dê um nome pro reagente'),
    },
  });

  const dimension = reagentAddMode
    ? reagentForm.values.dimension
    : (getReagentById(itemForm.values.reagentId)?.dimension ?? null);

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

  // Campo dimensão aparece em branco

  const handleSubmitItem = (item: Item) => {
    props.onCloseItemModal();

    if (props.selectedItem) props.onEditItem(item);
    else props.onAddItem(item);
    itemForm.reset();
  };

  useEffect(() => {
    if (props.selectedItem) itemForm.setValues(props.selectedItem);
    else itemForm.reset();
  }, [props.selectedItem]);

  // Garantem que com a mudança de valores, o campo de unidade esteja sempre válido

  reagentForm.watch('dimension', (value) => {
    itemForm.setFieldValue('unit', DimensionDefaultUnit[value.value]);
  });

  itemForm.watch('reagentId', (value) => {
    const reagentDimension = getReagentById(value.value)?.dimension;
    if (reagentDimension) itemForm.setFieldValue('unit', DimensionDefaultUnit[reagentDimension]);
  });

  useEffect(() => {
    if (reagentAddMode) {
      itemForm.setFieldValue('unit', DimensionDefaultUnit[dimension!]);
    } else {
      const reagentDimension = getReagentById(itemForm.values.reagentId)?.dimension;
      if (reagentDimension) itemForm.setFieldValue('unit', DimensionDefaultUnit[reagentDimension!]);
    }
  }, [reagentAddMode]);

  // Deixa selecionado o reagente criado

  // FIXME: Isso não está imprimindo??? E tem que certificar que dá certo
  console.log('AAAAAAAAAAAAAAAA');
  // const reagent = reagents?.find((reag) => createdReagentName.includes(reag.name));

  useEffect(() => {
    const reagent = reagents?.find((reag) => createdReagentName.includes(reag.name));
    console.log(createdReagentName, reagents, reagent);
    if (reagent) itemForm.setFieldValue('reagentId', reagent.id);
  }, [createdReagentName]);

  // Dar erro se já existir!
  // Incluir view que permite olhar definições e editar, mas que deve ser pouco usada
  // Voltar pra opção já existente de definição???

  // FIXME: Não está adicionando sempre!!!

  return (
    <Box>
      {reagentAddMode && (
        <Box
          pt="md"
          px="sm"
          mb="md"
          style={{
            border: '1px solid var(--mantine-color-default-border)',
            borderRadius: 'var(--mantine-radius-sm)',
          }}
        >
          <Text fw="bold" mb="md">
            Novo reagente
          </Text>
          <form
            onSubmit={reagentForm.onSubmit((values) => {
              props.onAddReagent(values);
              setCreatedReagentName(values.name);
              reagentForm.reset();
              toggleReagentAddMode();
            })}
          >
            <Grid>
              <Grid.Col span={{ base: 6 }}>
                <TextInput
                  ref={inputFocusRef}
                  label="Nome"
                  {...reagentForm.getInputProps('name')}
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
            </Grid>
            <Group my="lg" justify="right">
              <Button
                variant="outline"
                onClick={() => {
                  toggleReagentAddMode();
                  //FIXME: Tem que resetar
                  reagentForm.reset();
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">Adicionar</Button>
            </Group>
          </form>
        </Box>
      )}

      {/* 
      Tem que acessr o onSubmit e validar!
      Tem que salvar o reagente
      Tem que associar o reagente ao item
      Independente se edição ou criação
      */}

      <form
        onSubmit={itemForm.onSubmit((values) => {
          handleSubmitItem(values);
        })}
      >
        <Grid>
          {!reagentAddMode && (
            <Grid.Col span={{ base: 12 }}>
              <Group justify="space-between" align="end">
                <Select
                  style={{ flex: 1 }}
                  label="Reagente"
                  data={
                    reagents?.map((opt) => ({
                      value: opt.id,
                      label: opt.name,
                    })) ?? []
                  }
                  searchable
                  allowDeselect={false}
                  {...itemForm.getInputProps('reagentId')}
                ></Select>
                <Button
                  variant="outline"
                  onClick={() => {
                    toggleReagentAddMode();
                  }}
                >
                  +
                </Button>
              </Group>
            </Grid.Col>
          )}

          <Grid.Col span={{ base: 6 }}>
            <NumberInput
              disabled={reagentAddMode}
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
              disabled={reagentAddMode || itemForm.values.reagentId === '[NULL]'}
              {...itemForm.getInputProps('unit')}
            ></Select>
          </Grid.Col>

          <Grid.Col span={{ base: 6 }}>
            <NumberInput
              disabled={reagentAddMode}
              label="Pureza"
              placeholder="Pureza em %"
              hideControls
              suffix=" %"
              {...itemForm.getInputProps('purity')}
            ></NumberInput>
          </Grid.Col>

          <Grid.Col span={{ base: 6 }}>
            <DatePickerInput
              disabled={reagentAddMode}
              clearable
              valueFormat="DD/MM/YYYY"
              label="Vencimento"
              placeholder="Selecione data"
              {...itemForm.getInputProps('expireDate')}
            ></DatePickerInput>
          </Grid.Col>
        </Grid>
        <Box>
          <Group mt="xl" justify="right">
            <Button disabled={reagentAddMode} type="submit">
              {props.selectedItem ? 'Salvar' : 'Adicionar'}
            </Button>
            <Button
              disabled={reagentAddMode}
              variant="outline"
              onClick={() => {
                props.onCloseItemModal();
              }}
            >
              Cancelar
            </Button>
          </Group>
        </Box>
      </form>
    </Box>
  );
}
