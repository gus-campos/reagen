import { collection } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Box, ComboboxItem, ComboboxItemGroup, Grid, NumberInput, Select } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { Definition } from '@/src/models/definition';
import { definitionConverter } from '@/src/services/definitionsDB';
import { db } from '@/src/utils/firebase';
import { Reagent } from '../../models/reagent';
import Unit, { Dimension, UnitDimension } from '../../models/unit';
import { toNullableLocalDate, validateDate } from '../../utils/date';
import { formattedAmount } from '../../utils/formatted-amount';
import { formattedDate } from '../../utils/formatted-date';
import { DataModal } from '../Crud/Table/Modal/DataModal';

type ReagentModalProps = {
  showMode: boolean;
  selectedReagent: Reagent | null;
  reagentModalOpened: boolean;
  onCloseReagentModal: () => void;
  onAddReagent: (reagent: Reagent) => void;
  onEditReagent: (selectedReagent: Reagent) => void;
  onBeginShownReagentEdit: () => void;
};

export function ReagentModal(props: ReagentModalProps) {
  const [definitions] = useCollectionData<Definition>(
    collection(db, 'definitions').withConverter(definitionConverter)
  );

  const validateAmount = (value: number): string | null => {
    const countUnits =
      unitSelectOptions.find((group) => group.group == Dimension.COUNT)?.items ?? [];

    return value > 0
      ? !countUnits.includes(form.values.unit) || value % 1 == 0
        ? null
        : 'Precisa ser inteiro'
      : 'Só é possível adicionar quantidade maior que 0';
  };

  const form = useForm<Reagent>({
    initialValues: props.selectedReagent || {
      id: crypto.randomUUID(),
      definition: { id: '-1', name: '', dimension: Dimension.COUNT },
      inDate: null,
      outDate: null,
      expireDate: null,
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
      definition: (definition) => (definition.id !== '-1' ? null : 'Inserir uma definição'),
      amount: validateAmount,
      unit: (unit) => (unit != null ? null : 'Inserir unidade de medida'),
      inDate: (date: Date | null) => validateDate(date),
      outDate: (date: Date | null) => validateDate(date, true),
      expireDate: (date: Date | null) => validateDate(date, true),
    },
  });

  const dimension = form.values.definition.dimension ?? null;
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

  return (
    <DataModal
      dataName="reagente"
      form={form}
      modalOpened={props.reagentModalOpened}
      onAddData={props.onAddReagent}
      onCloseModal={props.onCloseReagentModal}
      onEditData={props.onEditReagent}
      onBeginShownDataEdit={props.onBeginShownReagentEdit}
      showMode={props.showMode}
      selectedData={props.selectedReagent}
      showModeChildren={
        <Box
          style={{
            padding: '10px',
          }}
        >
          {props.selectedReagent && (
            <Grid>
              <Grid.Col span={{ base: 12 }}>
                <strong>Definição:</strong> {props.selectedReagent.definition.name}
              </Grid.Col>

              <Grid.Col span={{ base: 12 }}>
                <strong>Quantidade:</strong> {formattedAmount(props.selectedReagent)}
              </Grid.Col>

              <Grid.Col span={{ base: 12 }}>
                <strong>Entrada:</strong> {formattedDate(props.selectedReagent.inDate)}
              </Grid.Col>

              <Grid.Col span={{ base: 12 }}>
                <strong>Saída:</strong> {formattedDate(props.selectedReagent.outDate)}
              </Grid.Col>

              <Grid.Col span={{ base: 12 }}>
                <strong>Vencimento:</strong> {formattedDate(props.selectedReagent.expireDate)}
              </Grid.Col>
            </Grid>
          )}
        </Box>
      }
      editModeChildren={
        <Grid>
          <Grid.Col span={{ base: 12 }}>
            <Select
              label="Definição"
              data={definitions?.map((opt) => ({ value: opt.id, label: opt.name })) ?? []}
              value={form.values.definition?.id ?? null}
              searchable
              allowDeselect={false}
              onChange={(value) => {
                const definition = definitions?.find((def) => def.id === value) ?? null;
                if (definition) form.setFieldValue('definition', definition);
              }}
              error={form.errors.definition}
            ></Select>
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
              disabled={form.values.definition.id === '-1'}
            ></Select>
          </Grid.Col>

          {/* TODO: Datas todas iguais entrada */}
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
      }
    />
  );
}
