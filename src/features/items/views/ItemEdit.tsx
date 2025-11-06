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
  onBeginShownItemEdit?: () => void;
  onAddReagent: (reagent: Reagent) => void;
  preFilledItemData?: Partial<Item>;
};

// FIXME: Melhorar, reduzir

const nullSize = { amount: 0, unit: Unit.UNITS };

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
      size: nullSize,
      purity: 0,
      id: '',
      reagentId: '',
      brandId: '',
      laboratoryId: '',
      supplierId: '',

      // Sobrescrevendo campos pré definidos
      ...props.preFilledItemData,
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
      // Se já tiver selecionado reagente, e
      size: (value: Size, values: Item) =>
        values.reagentId !== '' && (value === ('' as any) || value.amount === 0)
          ? 'Selecione um tamanho válido'
          : null,
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

  // Seleciona o reagente recém criado e reseta o tamanho
  useEffect(() => {
    if (!reagentAddMode && !loadingAddReagent && createdReagentName !== '') {
      const reagent = reagents?.find((reag) => createdReagentName.trim() === reag.name.trim());
      if (!reagent) {
        return;
      }
      itemForm.setValues({ reagentId: reagent.id });
      setCreatedReagentName('');
    }

    itemForm.setFieldValue('size', '' as any);
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

  const handleChangeSize = (value: string | null) => {
    if (value === null || value === '') {
      itemForm.setFieldValue('size', '' as any);
      itemForm.setTouched({ ...itemForm.isTouched, size: false });
    } else {
      const sizeObj = selectedReagent?.sizes.find((s) => formattedSize(s) === value);
      itemForm.setFieldValue('size', sizeObj ?? ('' as any));
    }
  };
  // FIXME: ERRO AO DESMARCAR MARCA!!!

  const handleChangeReagent = (value: string | null) => {
    const validReagent = reagents?.find((r) => r.id === value);
    itemForm.setValues({
      reagentId: validReagent?.id ?? undefined,
    });

    itemForm.setFieldValue('size', validReagent?.sizes[0] ?? ('' as any));
  };

  console.log(itemForm.values.size);

  return (
    <Box>
      {/* Adição de reagente */}
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
        {/* Seleção de reagente */}
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
                  onChange={handleChangeReagent}
                  value={itemForm.values.reagentId}
                  error={itemForm.errors.reagentId}
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

      {/* Adição de tamanho */}
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
        {/* Seleção de tamanho */}
        {!sizeAddMode && (
          <Grid>
            <Grid.Col span={{ base: 12 }}>
              <Group justify="space-between" align="end">
                <Select
                  filter={portugueseSearchFilter}
                  placeholder="Selecione ou adicione o tamanho"
                  style={{ flex: 1 }}
                  allowDeselect={false}
                  data={
                    selectedReagent ? selectedReagent.sizes.map((s) => formattedSize(s)) : undefined
                  }
                  label="Tamanho"
                  disabled={!selectedReagent || reagentAddMode}
                  onChange={handleChangeSize}
                  value={itemForm.values.size ? formattedSize(itemForm.values.size) : null}
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
                const brand = value ? getBrandById(value) : null;
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
                const laboratory = value ? getLaboratoryById(value) : null;
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
                const supplier = value ? getSupplierById(value) : null;
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
