import { Button, NumberInput, Paper, Stack } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { DataTable } from '@/features/data-table/data-table.view';
import { usePackageVialsTable } from '@/features/package/components/package-vials-table.viewmodel';
import { StockFilter } from '@/features/stock-filter/stock-filter.type';
import { Vial } from '@/features/vial/vial.type';
import { WithId } from '@/shared/types/id.type';

export type VialUpdateDto = Partial<Vial> & WithId;

type PackageVialsTableModes = 'edit-vials' | 'add-vials' | 'out-mode';

export type PackageVialsTableProps = {
  vials: Vial[];
  filter?: StockFilter;

  // FIXME: Externamento dar update!!!
  onToMoveVialsSubmit: (vialUpdateDtos: VialUpdateDto[]) => void;

  // TODO: Mudar ações condicionalmente de acordo com o modo
  // mode: PackageVialsTableModes
  // onIncrementVialGroup
  // onDecrementVialGroup
  // onDeleteVialGroup
};

export function PackageVialsTable(props: PackageVialsTableProps) {
  const { packageVialGroups, columns, extraActions, dataFilter } = usePackageVialsTable({
    ...props,
  });

  return (
    <Paper p="lg">
      <DataTable
        datas={packageVialGroups}
        collumns={columns}
        smallHeading
        extraActions={extraActions}
        dataFilter={dataFilter}
      />
    </Paper>
  );
}

// Formulário para o Popover do action da table

export type OutVialsFormType = {
  outDate: Date | null;
  amount: number;
};

export type OutVialFormViewProps = {
  modalIncludeDate: boolean;
  onSubmit: (values: OutVialsFormType) => void;
  maxAmount: number;
};

export function OutVialFormView(props: OutVialFormViewProps) {
  const outVialsForm = useForm<OutVialsFormType>({
    initialValues: {
      amount: props.maxAmount,
      outDate: new Date(),
    },
    validate: {
      outDate: (value) => (value ? null : 'Insira um data'),
      amount: (value) => (value > 0 ? null : 'Insira um valor maior que 0'),
    },
  });

  return (
    <form onSubmit={outVialsForm.onSubmit(props.onSubmit)}>
      <Stack>
        {/* Seletor de data */}
        {props.modalIncludeDate && (
          <DatePickerInput
            label="Data de saída"
            placeholder="Selecione uma data de saída"
            valueFormat="DD/MM/YYYY"
            {...outVialsForm.getInputProps('outDate')}
          />
        )}
        {/* Seletor de quantidade */}
        <NumberInput
          label="Quantidade de frascos"
          placeholder="Selecione uma quantidade"
          allowNegative={false}
          allowDecimal={false}
          min={1}
          max={props.maxAmount}
          {...outVialsForm.getInputProps('amount')}
        />
        {/* Confirmação */}
        <Button style={{ width: '100%' }} type="submit">
          Confirmar
        </Button>
      </Stack>
    </form>
  );
}
