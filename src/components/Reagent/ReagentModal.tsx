import { Box, ComboboxItemGroup, Grid, NumberInput, Select } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useData } from '@/src/providers/DataProvider';
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
  const { definitions, getDefinitionById } = useData();

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
      id: '[NULL]',
      definitionId: '',
      expireDate: null,
      amount: 0,
      purity: 0,
      unit: Unit.GRAM,
      operationsIds: [],
    },

    transformValues: (values) => ({
      ...values,
      expireDate: toNullableLocalDate(values.expireDate),
    }),

    validate: {
      definitionId: (id) => (id !== '' ? null : 'Inserir uma definição'),
      amount: validateAmount,
      unit: (unit) => (unit != null ? null : 'Inserir unidade de medida'),
      purity: (value) => (value > 1 && value <= 100 ? null : 'Insira uma pureza entre 1 e 100 %'),
      expireDate: (date: Date | null) => validateDate(date, false),
    },
  });

  const dimension = getDefinitionById(form.values.definitionId)?.dimension ?? null;
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
                <strong>Definição:</strong>{' '}
                {getDefinitionById(props.selectedReagent.definitionId)?.name ?? 'ND'}
              </Grid.Col>

              <Grid.Col span={{ base: 12 }}>
                <strong>Quantidade:</strong> {formattedAmount(props.selectedReagent)}
              </Grid.Col>

              <Grid.Col span={{ base: 12 }}>
                <strong>Pureza:</strong>{' '}
                {props.selectedReagent.purity ? `${props.selectedReagent.purity} %` : ''}
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
              searchable
              allowDeselect={false}
              {...form.getInputProps('definitionId')}
            ></Select>
          </Grid.Col>

          <Grid.Col span={{ base: 6 }}>
            <NumberInput
              label="Quantidade"
              placeholder="Quantidade"
              hideControls
              {...form.getInputProps('amount')}
            ></NumberInput>
          </Grid.Col>

          <Grid.Col span={{ base: 6 }}>
            <Select
              allowDeselect={false}
              label="Unidade"
              data={unitSelectOptions}
              disabled={form.values.definitionId === ''}
              {...form.getInputProps('unit')}
            ></Select>
          </Grid.Col>

          <Grid.Col span={{ base: 6 }}>
            <NumberInput
              label="Pureza"
              placeholder="Pureza em %"
              hideControls
              suffix=" %"
              {...form.getInputProps('purity')}
            ></NumberInput>
          </Grid.Col>

          <Grid.Col span={{ base: 6 }}>
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
