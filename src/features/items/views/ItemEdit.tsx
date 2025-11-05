import { useEffect, useState } from 'react';
import { Box, Button, Grid, Group, NumberInput, Select, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { Item } from '@/src/features/items/types/item';
import { ReagentService } from '@/src/features/reagents/services/ReagentService';
import { Reagent } from '@/src/features/reagents/types/reagent';
import { Size } from '@/src/features/reagents/types/size';
import Unit from '@/src/features/reagents/types/unit';
import { useData } from '@/src/providers/DataProvider';
import { toNullableLocalDate, validateDate } from '@/src/shared/utils/date';
import { portugueseSearchFilter } from '@/src/shared/utils/portuguese-search-filter';
import { formattedSize } from '../../reagents/utils/formatted-amount';
import { SizeAddForm } from '../../reagents/views/SizeAddForm';
import { ItemSubReagentAddForm } from './ItemSubReagentAddForm';

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
  const {
    reagents,
    suppliers,
    brands,
    laboratories,
    getReagentById,
    getBrandById,
    getLaboratoryById,
    getSupplierById,
  } = useData();

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
      inDate: new Date(),
      expireDate: new Date(),
      outDate: null,
      size: { amount: 0, unit: Unit.GRAM },
      purity: 0,
      id: '',
      reagentId: '',
      brandId: '',
      laboratoryId: '',
      supplierId: '',
    },

    // FIXME: tipagem
    transformValues: (values: Item) => ({
      ...values,
      expireDate: toNullableLocalDate(values.expireDate)!,
      inDate: toNullableLocalDate(values.inDate)!,
      outDate: toNullableLocalDate(values.outDate),
      // Começa como string vazia indicadora de null, e converte pra null se necessário
      brandId: values.brandId !== '' ? values.brandId : null,
    }),

    validate: {
      reagentId: (id) => (id !== '' || reagentAddMode ? null : 'Inserir um reagente'),
      purity: (value) => (value >= 1 && value <= 100 ? null : 'Insira uma pureza entre 1 e 100 %'),
      size: (value: Size, values: Item) =>
        values.reagentId !== '' && value.amount === 0 ? 'Selecione um tamanho' : null,
      expireDate: (date: Date | null) => validateDate(date, false),
      inDate: (date: Date | null) => validateDate(date, false),
    },
  });

  const selectedReagent: Reagent | null =
    itemForm.values.reagentId !== '' ? getReagentById(itemForm.values.reagentId) : null;

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
        (size: Size) => formattedSize(size) === formattedSize(addedSize)
      );
      if (!sizeAddMode && !loadingAddSize && addedSize) {
        itemForm.setValues({ size: selectedSize });
        setAddedSize(null);
      }
    }
  }, [loadingAddSize]);

  // HANDLES

  const handleAddSize = (size: Size) => {
    const newReagent = { ...selectedReagent!, sizes: [...selectedReagent!.sizes, size] };
    ReagentService.instance.update(selectedReagent!.id, newReagent);
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
        <ItemSubReagentAddForm
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
                  filter={portugueseSearchFilter}
                  placeholder="Selecione ou adicione o reagente"
                  disabled={sizeAddMode || !!props.selectedItem}
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
                {!props.selectedItem && (
                  <Button
                    disabled={sizeAddMode}
                    variant="outline"
                    onClick={() => {
                      setReagentAddMode(true);
                    }}
                  >
                    +
                  </Button>
                )}
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
                  filter={portugueseSearchFilter}
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
                  error={itemForm.errors.size}
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
            <Select
              filter={portugueseSearchFilter}
              label="Marca"
              placeholder="Nome da marca"
              data={brands!.map((b) => {
                return { value: b.id, label: b.name };
              })}
              onChange={(value) => {
                const brand = getBrandById(value!);
                itemForm.setValues({ brandId: brand?.id ?? '' });
              }}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12 }}>
            <Select
              filter={portugueseSearchFilter}
              label="Laboratório"
              placeholder="Nome do laboratório"
              data={laboratories!.map((l) => {
                return { value: l.id, label: l.name };
              })}
              onChange={(value) => {
                const laboratory = getLaboratoryById(value!);
                itemForm.setValues({ laboratoryId: laboratory?.id ?? '' });
              }}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12 }}>
            <Select
              filter={portugueseSearchFilter}
              label="Fornecedor"
              placeholder="Nome do fornecedor"
              data={suppliers!.map((s) => {
                return { value: s.id, label: s.name };
              })}
              onChange={(value) => {
                const supplier = getSupplierById(value!);
                itemForm.setValues({ supplierId: supplier?.id ?? '' });
              }}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 4 }}>
            <DatePickerInput
              disabled={reagentAddMode || sizeAddMode}
              clearable
              valueFormat="DD/MM/YYYY"
              label="Entrada"
              placeholder="Selecione data"
              {...itemForm.getInputProps('inDate')}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 4 }}>
            <DatePickerInput
              disabled={reagentAddMode || sizeAddMode}
              clearable
              valueFormat="DD/MM/YYYY"
              label="Vencimento"
              placeholder="Selecione data"
              {...itemForm.getInputProps('expireDate')}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 4 }}>
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
