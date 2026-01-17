import { useState } from 'react';
import { FaCalendar } from 'react-icons/fa6';
import { MdCancel } from 'react-icons/md';
import { Badge, Group, Tooltip } from '@mantine/core';
import { TableCollumn } from '@/features/data-table/data-table.type';
import { CrudAction } from '@/features/data-table/data-table.view';
import {
  OutVialFormView,
  OutVialsFormType,
  PackageVialsTableProps,
} from '@/features/package/components/package-vials-table.view';
import { filteredVial } from '@/features/stock-filter/stock-filter.util';
import { VialService } from '@/features/vial/vial.service';
import { Vial } from '@/features/vial/vial.type';
import { useData } from '@/providers/data.provider';
import { stringToLocalDate } from '@/shared/utils/date';
import { formattedDate } from '@/shared/utils/formatted-date';

type UsePackageVialsTableProps = PackageVialsTableProps & {
  vialService: VialService;
};

type VialGroup = {
  index: number;
  vials: Vial[];
  laboratoryId: string;
  outDate: Date | null;
};

export function usePackageVialsTable(props: UsePackageVialsTableProps) {
  const { vials, getLaboratoryById } = useData();
  const [modalMode, setModalMode] = useState<'out' | 'cancel'>('out');
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number | null>(null);

  const packageVials = vials?.filter((v) => v.packageId === props.data.id) ?? [];

  const packageVialGroups = packageVials.reduce((groups, vial) => {
    for (const group of groups) {
      if (
        group.laboratoryId === vial.laboratoryId &&
        group.outDate?.getTime() === vial.outDate?.getTime()
      ) {
        group.vials.push(vial);
        return groups;
      }
    }

    // Se nenhuma coincidiu
    groups.push({
      laboratoryId: vial.laboratoryId,
      outDate: vial.outDate,
      vials: [vial],
      index: groups.length,
    });
    return groups;

    // Criar o grupo
  }, [] as VialGroup[]);

  const outVialsSubmit = (values: OutVialsFormType) => {
    // Não deveria acontecer
    if (selectedGroupIndex === null) return;
    const selectedGroup = packageVialGroups.find((group) => selectedGroupIndex === group.index);
    // Não deveria acontecer
    if (!selectedGroup) return;
    // Quantidade inválida: não deveria acontecer
    if (values.amount < 0 || values.amount > selectedGroup?.vials.length) return;
    const date = values.outDate ? stringToLocalDate(values.outDate) : null;

    // TODO: Precisa mudar data pra bater com o início do dia? Ver no agrupamento

    for (let i = 0; i < values.amount; i++) {
      const vial = selectedGroup.vials[i];
      props.vialService.update(vial.id, {
        outDate: modalMode === 'cancel' ? null : date,
      });
    }

    setSelectedGroupIndex(null);
  };

  const onCloseForm = () => {
    setSelectedGroupIndex(null);
  };

  // Obs: Não é necessário separar frascos que estão agrupados, já que não divergem em nada
  const dataFilter = props.filter
    ? (group: VialGroup) => group.vials.some((vial) => filteredVial(vial, props.filter!))
    : undefined;

  const outSortValue = (vial: VialGroup) => (vial.outDate ? 1 : -1);

  const collumns: TableCollumn<VialGroup>[] = [
    {
      name: 'Laboratório',
      accessor: (group: VialGroup) => (
        <Group>
          {getLaboratoryById(group.laboratoryId).name}{' '}
          <Badge size="sm" color={group.outDate ? 'grey' : undefined}>
            x {group.vials.length}
          </Badge>
        </Group>
      ),
      sorter: (a: VialGroup, b: VialGroup) => {
        const outDiff = outSortValue(a) - outSortValue(b);
        const labDiff = getLaboratoryById(a.laboratoryId).name.localeCompare(
          getLaboratoryById(b.laboratoryId).name
        );
        const amountDiff = a.vials.length - b.vials.length;
        return outDiff || labDiff || amountDiff;
      },
    },
    {
      name: 'Saída',
      accessor: (group: VialGroup) => (group.outDate ? formattedDate(group.outDate) : '--'),
      sorter: (a: VialGroup, b: VialGroup) =>
        (a.outDate?.getTime() ?? Infinity) - (b.outDate?.getTime() ?? Infinity),
    },
  ];

  // Duplicação de código necessária a baixo, cuidado ao modificar
  const extraActions: CrudAction<VialGroup>[] = [
    {
      icon: (
        <Tooltip label="Cancelar saída">
          <MdCancel />
        </Tooltip>
      ),
      show: (group) => !!group.outDate,
      popover: {
        onOpen: (group) => {
          setSelectedGroupIndex(group.index);
          setModalMode('cancel');
        },
        onClose: onCloseForm,
        render: ({ closePopover, data }) => (
          <OutVialFormView
            // eslint-disable-next-line react/jsx-boolean-value
            modalIncludeDate={true}
            onSubmit={(values) => {
              outVialsSubmit(values);
              closePopover && closePopover();
            }}
            maxAmount={data.vials.length}
          />
        ),
      },
    },
    {
      icon: (
        <Tooltip label="Dar saída em...">
          <FaCalendar />
        </Tooltip>
      ),
      show: (group) => !group.outDate,
      popover: {
        onOpen: (group) => {
          setSelectedGroupIndex(group.index);
          setModalMode('out');
        },
        onClose: onCloseForm,
        render: ({ closePopover, data }) => (
          <OutVialFormView
            // eslint-disable-next-line react/jsx-boolean-value
            modalIncludeDate={true}
            onSubmit={(values) => {
              outVialsSubmit(values);
              closePopover && closePopover();
            }}
            maxAmount={data.vials.length}
          />
        ),
      },
    },
  ];

  return {
    packageVialGroups,
    collumns,
    extraActions,
    dataFilter,
    // Para testes
    outVialsSubmit,
  };
}
