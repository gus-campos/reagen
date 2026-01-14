import { useState } from 'react';
import { FaCalendar, FaSignOutAlt } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { Button, Modal, Paper, Stack, Tooltip } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { TableCollumn } from '@/features/data-table/data-table.type';
import { CrudAction, DataTable } from '@/features/data-table/data-table.view';
import { Package } from '@/features/package/package.type';
import { StockFilter } from '@/features/stock-filter/stock-filter.type';
import { filteredVial } from '@/features/stock-filter/stock-filter.util';
import { Vial } from '@/features/vial/vial.type';
import { useData } from '@/providers/data.provider';
import { useDependencyInjection } from '@/providers/dependency-injection.provider';
import { stringToLocalDate } from '@/shared/utils/date';
import { formattedDate } from '@/shared/utils/formatted-date';

type PackageVialsTableProps = {
  data: Package;
  filter?: StockFilter;
};

export function PackageVialsTable(props: PackageVialsTableProps) {
  const { vialService } = useDependencyInjection();
  const { vials, getLaboratoryById } = useData();
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedVialId, setSelectedVialId] = useState<string | null>(null);

  const form = useForm<{ outDate: Date }>({
    validate: {
      outDate: (value) => (value ? null : 'Insira um data'),
    },
  });

  const packageVials = vials?.filter((v) => v.packageId === props.data.id) ?? [];

  const collumns = [
    {
      name: 'Laboratório',
      accessor: (v: Vial) => getLaboratoryById(v.laboratoryId).name,
      sorter: (a: Vial, b: Vial) =>
        getLaboratoryById(a.laboratoryId).name.localeCompare(
          getLaboratoryById(b.laboratoryId).name
        ),
    },
    {
      name: 'Saída',
      accessor: (v: Vial) => (v.outDate ? formattedDate(v.outDate) : '--'),
      sorter: (a: Vial, b: Vial) =>
        (a.outDate?.getTime() ?? Infinity) - (b.outDate?.getTime() ?? Infinity),
    },
  ] as TableCollumn<Vial>[];

  const extraActions = [
    // Anular data de saída
    {
      icon: (
        <Tooltip label="Cancelar saída">
          <MdCancel />
        </Tooltip>
      ),
      action: (vial: Vial) => {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        vialService.update(vial.id, { outDate: null });
      },
    },
    // Saída no dia de hoje
    {
      icon: (
        <Tooltip label="Dar saída hoje">
          <FaSignOutAlt />
        </Tooltip>
      ),
      action: (vial: Vial) => {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        vialService.update(vial.id, { outDate: startOfDay });
      },
    },
    // Saída em data específica
    {
      icon: (
        <Tooltip label="Dar saída em...">
          <FaCalendar />
        </Tooltip>
      ),
      action: (data) => {
        setSelectedVialId(data.id);
        setModalOpened(true);
      },
    },
  ] as CrudAction<Vial>[];

  const handleSubmit = (values: { outDate: Date }) => {
    if (!selectedVialId || !values.outDate) return;

    vialService.update(selectedVialId, {
      outDate: stringToLocalDate(values.outDate),
    });
    setSelectedVialId(null);
    setModalOpened(false);
  };

  const dataFilter = props.filter ? (vial: Vial) => filteredVial(vial, props.filter!) : undefined;

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
