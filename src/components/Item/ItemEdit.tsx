import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ComboboxItemGroup,
  Flex,
  Grid,
  Group,
  Loader,
  NumberInput,
  Select,
  Text,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { Reagent } from '@/src/models/reagent';
import { Size } from '@/src/models/size';
import { useData } from '@/src/providers/DataProvider';
import { uploadEditReagent } from '@/src/services/reagentsDB';
import { formattedSize } from '@/src/utils/formatted-amount';
import { Item } from '../../models/item';
import Unit from '../../models/unit';
import { toNullableLocalDate, validateDate } from '../../utils/date';
import { ReagentAddForm } from './ReagentAddForm';
import { SizeAddForm } from './SizeAddForm';

type ItemModalProps = {
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

  // Adição de reagente

  const [reagentAddMode, setReagentAddMode] = useState(false);
  const [createdReagentName, setCreatedReagentName] = useState('');
  const [loadingAddReagent, setLoadingAddReagent] = useState(false);

  // Adição de tamanho

  const [sizeAddMode, setSizeAddMode] = useState(false);
  const [addedSize, setAddedSize] = useState<Size | null>(null);
  const [loadingAddSize, setLoadingAddedSize] = useState(false);

  // ================= Forms e validação

  const itemForm = useForm<Item>({
    initialValues: props.selectedItem ?? {
      id: '[NULL]',
      reagentId: '[NULL]',
      inDate: new Date(),
      outDate: null,
      expireDate: new Date(),
      size: { amount: 0, unit: Unit.GRAM },
      purity: 0,
    },

    transformValues: (values: Item) => ({
      ...values,
      expireDate: toNullableLocalDate(values.expireDate)!,
      inDate: toNullableLocalDate(values.inDate)!,
      outDate: toNullableLocalDate(values.outDate),
    }),

    validate: {
      reagentId: (id) => (id !== '[NULL]' || reagentAddMode ? null : 'Inserir um reagente'),
      purity: (value) => (value >= 1 && value <= 100 ? null : 'Insira uma pureza entre 1 e 100 %'),
      size: (value) => (value.amount !== 0 ? null : 'Selecione um tamanho'),
      expireDate: (date: Date | null) => validateDate(date, false),
      inDate: (date: Date | null) => validateDate(date, false),
      outDate: (date: Date | null) => date !== null && validateDate(date, false),
    },
  });

  const selectedReagent = getReagentById(itemForm.values.reagentId) ?? null;

  // ================= Define e atualiza as opções de unidade

  // EFFECTS

  // Conclui a adição do reagente
  useEffect(() => {
    if (reagentAddMode && loadingAddReagent) {
      setReagentAddMode(false);
      setLoadingAddReagent(false);
    }
  }, [reagents]);

  // Conclui a adição do tamanho
  useEffect(() => {
    if (sizeAddMode && loadingAddSize) {
      setSizeAddMode(false);
      setLoadingAddedSize(false);
    }
  }, [reagents]);

  // Seleciona o reagente recém criado
  useEffect(() => {
    if (!reagentAddMode && !loadingAddReagent && createdReagentName !== '') {
      const reagent = reagents?.find((reag) => createdReagentName.trim() === reag.name.trim());
      if (!reagent) {
        return;
      }
      itemForm.setValues({ reagentId: reagent.id });
      setCreatedReagentName('');
    }
  }, [loadingAddReagent]);

  // Seleciona o tamanho recém-criado
  useEffect(() => {
    if (!sizeAddMode && !loadingAddSize && addedSize !== null) {
      const selectedSize = selectedReagent?.sizes.find(
        (size) => formattedSize(size) === formattedSize(addedSize)
      );
      if (!sizeAddMode && !loadingAddSize && addedSize) {
        itemForm.setValues({ size: selectedSize });
        setAddedSize(null);
      }
    }
  }, [loadingAddSize]);

  // HANDLES

  const handleAddSize = (size: Size) => {
    uploadEditReagent({ ...selectedReagent!, sizes: [...selectedReagent!.sizes, size] });
    setAddedSize(size);
    setLoadingAddedSize(true);
  };

  const handleSubmitItem = (item: Item) => {
    props.onCloseItemModal();
    if (props.selectedItem) {
      props.onEditItem(item);
    } else {
      props.onAddItem(item);
    }
  };

  return (
    <Box>
      {reagentAddMode && (
        <ReagentAddForm
          onAddReagent={props.onAddReagent}
          loadingAddReagent={loadingAddReagent}
          setCreatedReagentName={setCreatedReagentName}
          setLoadingAddReagent={setLoadingAddReagent}
          setReagentAddMode={setReagentAddMode}
        />
      )}

      <form
        onSubmit={itemForm.onSubmit((values) => {
          handleSubmitItem(values);
          itemForm.reset();
        })}
      >
        {!reagentAddMode && (
          <Grid>
            <Grid.Col span={{ base: 12 }}>
              <Group justify="space-between" align="end">
                <Select
                  placeholder="Selecione ou adicione o reagente"
                  disabled={sizeAddMode}
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
                />
                <Button
                  disabled={sizeAddMode}
                  variant="outline"
                  onClick={() => {
                    setReagentAddMode(true);
                  }}
                >
                  +
                </Button>
              </Group>
            </Grid.Col>
          </Grid>
        )}
      </form>

      {sizeAddMode && (
        <SizeAddForm
          onCancel={() => setSizeAddMode(false)}
          loadingAddSize={loadingAddSize}
          selectedReagent={selectedReagent!}
          onAddSize={handleAddSize}
        />
      )}

      <form
        onSubmit={itemForm.onSubmit((values) => {
          handleSubmitItem(values);
          itemForm.reset();
        })}
      >
        {!sizeAddMode && (
          <Grid>
            <Grid.Col span={{ base: 12 }}>
              <Group justify="space-between" align="end">
                <Select
                  placeholder="Selecione ou adicione o tamanho"
                  style={{ flex: 1 }}
                  allowDeselect={false}
                  data={selectedReagent?.sizes.map((s) => formattedSize(s))}
                  label="Tamanho"
                  disabled={!selectedReagent || reagentAddMode}
                  onChange={(value) =>
                    itemForm.setValues({
                      size:
                        selectedReagent?.sizes.find((s) => formattedSize(s) === value) ?? undefined,
                    })
                  }
                  value={formattedSize(itemForm.values.size)}
                />
                <Button
                  disabled={!selectedReagent || reagentAddMode}
                  variant="outline"
                  onClick={() => {
                    setSizeAddMode(true);
                  }}
                >
                  +
                </Button>
              </Group>
            </Grid.Col>
          </Grid>
        )}

        <Grid>
          <Grid.Col span={{ base: 6 }}>
            <NumberInput
              disabled={reagentAddMode || sizeAddMode}
              label="Pureza"
              placeholder="Pureza em %"
              hideControls
              suffix=" %"
              {...itemForm.getInputProps('purity')}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 6 }}>
            <DatePickerInput
              disabled={reagentAddMode || sizeAddMode}
              clearable
              valueFormat="DD/MM/YYYY"
              label="Vencimento"
              placeholder="Selecione data"
              {...itemForm.getInputProps('expireDate')}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 6 }}>
            <DatePickerInput
              disabled={reagentAddMode || sizeAddMode}
              clearable
              valueFormat="DD/MM/YYYY"
              label="Entrada"
              placeholder="Selecione data"
              {...itemForm.getInputProps('inDate')}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 6 }}>
            <DatePickerInput
              disabled={reagentAddMode || sizeAddMode}
              clearable
              valueFormat="DD/MM/YYYY"
              label="Saída"
              placeholder="Selecione data"
              {...itemForm.getInputProps('outDate')}
            />
          </Grid.Col>
        </Grid>
        <Box>
          <Group mt="xl" justify="right">
            <Button
              variant="outline"
              onClick={() => {
                props.onCloseItemModal();
              }}
            >
              Cancelar
            </Button>
            <Button disabled={reagentAddMode || sizeAddMode} type="submit">
              {props.selectedItem ? 'Salvar' : 'Adicionar'}
            </Button>
          </Group>
        </Box>
      </form>
    </Box>
  );
}
