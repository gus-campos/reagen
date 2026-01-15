import { Button, Modal, Paper, Stack } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { DataTable } from '@/features/data-table/data-table.view';
import { Package } from '@/features/package/package.type';
import { StockFilter } from '@/features/stock-filter/stock-filter.type';
import { usePackageVialsTable } from '@/features/package/views/package-vials-table.viewmodel';
import { useDependencyInjection } from '@/providers/dependency-injection.provider';

export type PackageVialsTableProps = {
  data: Package;
  filter?: StockFilter;
};

export function PackageVialsTable(props: PackageVialsTableProps) {
  const { vialService } = useDependencyInjection();
  const {
    modalOpened,
    packageVials,
    collumns,
    extraActions,
    form,
    dataFilter,
    setModalOpened,
    handleSubmit,
  } = usePackageVialsTable({ ...props, vialService });

  return (
    <>
      <Paper p="lg">
        <DataTable
          datas={packageVials}
          collumns={collumns}
          smallHeading
          extraActions={extraActions}
          dataFilter={dataFilter}
        />
      </Paper>

      {/* Modal de seleção de data de saída */}
      <Modal title="Data de saída" opened={modalOpened} onClose={() => setModalOpened(false)}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {/* Seletor de data */}
            <DatePickerInput
              label="Data de saída"
              placeholder="Selecione uma data de saída..."
              valueFormat="DD/MM/YYYY"
              {...form.getInputProps('outDate')}
            />
            {/* Confirmação */}
            <Button style={{ width: '100%' }} type="submit">
              Declarar saída nesta data
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
