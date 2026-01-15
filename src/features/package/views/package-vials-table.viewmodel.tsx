import { useState } from 'react';
import { FaCalendar, FaSignOutAlt } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { Tooltip } from '@mantine/core';
import { useForm } from '@mantine/form';
import { TableCollumn } from '@/features/data-table/data-table.type';
import { CrudAction } from '@/features/data-table/data-table.view';
import { PackageVialsTableProps } from '@/features/package/views/package-vials-table.view';
import { filteredVial } from '@/features/stock-filter/stock-filter.util';
import { VialService } from '@/features/vial/vial.service';
import { Vial } from '@/features/vial/vial.type';
import { useData } from '@/providers/data.provider';
import { stringToLocalDate } from '@/shared/utils/date';
import { formattedDate } from '@/shared/utils/formatted-date';

type UsePackageVialsTableProps = PackageVialsTableProps & {
  vialService: VialService;
};

export function usePackageVialsTable(props: UsePackageVialsTableProps) {
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
      name: 'Quantidade ',
      accessor: (v: Vial) => getLaboratoryById(v.laboratoryId).name,
      sorter: (a: Vial, b: Vial) =>
        getLaboratoryById(a.laboratoryId).name.localeCompare(
          getLaboratoryById(b.laboratoryId).name
        ),
    },
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
    {
      icon: (
        <Tooltip label="Cancelar saída">
          <MdCancel />
        </Tooltip>
      ),
      action: (vial: Vial) => {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        props.vialService.update(vial.id, { outDate: null });
      },
    },
    {
      icon: (
        <Tooltip label="Dar saída hoje">
          <FaSignOutAlt />
        </Tooltip>
      ),
      action: (vial: Vial) => {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        props.vialService.update(vial.id, { outDate: startOfDay });
      },
    },
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

    props.vialService.update(selectedVialId, {
      outDate: stringToLocalDate(values.outDate),
    });
    setSelectedVialId(null);
    setModalOpened(false);
  };

  const dataFilter = props.filter ? (vial: Vial) => filteredVial(vial, props.filter!) : undefined;

  return {
    modalOpened,
    packageVials,
    collumns,
    extraActions,
    form,
    dataFilter,
    setModalOpened,
    handleSubmit,
  };
}
