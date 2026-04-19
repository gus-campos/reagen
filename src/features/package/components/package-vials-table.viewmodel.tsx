import { MdCancel } from 'react-icons/md';
import { RiInboxUnarchiveFill } from 'react-icons/ri';
import { Badge, Group, Tooltip } from '@mantine/core';
import { TableCollumn } from '@/features/data-table/data-table.type';
import { CrudAction } from '@/features/data-table/data-table.view';
import {
  OutVialFormView,
  OutVialsFormType,
  PackageVialsTableProps,
  VialUpdateDto,
} from '@/features/package/components/package-vials-table.view';
import { filteredVial } from '@/features/stock-filter/stock-filter.util';
import { Vial } from '@/features/vial/vial.type';
import { useData } from '@/providers/data.provider';
import { stringToLocalDate } from '@/shared/utils/date';
import { formattedDate } from '@/shared/utils/formatted-date';

type VialGroup = {
  index: number;
  vials: Vial[];
  laboratoryId: string;
  outDate: Date | null;
};

type OutMode = 'out' | 'cancel';

export function usePackageVialsTable(props: PackageVialsTableProps) {
  const { getLaboratoryById } = useData();

  const packageVialGroups = props.vials.reduce((groups, vial) => {
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

  const outMoveVialsSubmit = (values: OutVialsFormType, mode: OutMode, group: VialGroup) => {
    if (values.amount < 0 || values.amount > group.vials.length) return;
    const date = values.outDate ? stringToLocalDate(values.outDate) : null;

    const vialsUpdateDtos: VialUpdateDto[] = Array.from({ length: values.amount }, (_, index) => {
      const vial = group.vials[index];
      
      return {
        id: vial.id,
        outDate: mode === 'cancel' ? null : date,
      };
    });

    props.onToMoveVialsSubmit(vialsUpdateDtos);
  };

  // Observação: Não é necessário separar frascos que estão agrupados, já que não divergem em nada
  const dataFilter = props.filter
    ? (group: VialGroup) => group.vials.some((vial) => filteredVial(vial, props.filter!))
    : undefined;

  const outDateSortDiff = (vial: VialGroup) => (vial.outDate ? 1 : -1);

  const columns: TableCollumn<VialGroup>[] = [
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
        const outDiff = outDateSortDiff(a) - outDateSortDiff(b);
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

  // TODO: Mudar ações condicionalmente de acordo com o modo

  const showExtraActions: CrudAction<VialGroup>[] = [
    {
      icon: (
        <Tooltip label="Cancelar saída...">
          <MdCancel />
        </Tooltip>
      ),
      show: (group) => !!group.outDate,
      popover: {
        // Duplicação de código necessária a baixo, cuidado ao modificar
        render: ({ closePopover, data }) => (
          <OutVialFormView
            modalIncludeDate={false}
            onSubmit={(values) => {
              outMoveVialsSubmit(values, 'cancel', data);
              closePopover && closePopover();
            }}
            maxAmount={data.vials.length}
          />
        ),
      },
    },
    {
      icon: (
        <Tooltip label="Dar saída...">
          <RiInboxUnarchiveFill />
        </Tooltip>
      ),
      show: (group) => !group.outDate,
      popover: {
        // Duplicação de código necessária a baixo, cuidado ao modificar
        render: ({ closePopover, data }) => (
          <OutVialFormView
            // eslint-disable-next-line react/jsx-boolean-value
            modalIncludeDate={true}
            onSubmit={(values) => {
              outMoveVialsSubmit(values, 'out', data);
              closePopover && closePopover();
            }}
            maxAmount={data.vials.length}
          />
        ),
      },
    },
  ];

  const extraActions = showExtraActions;

  return {
    packageVialGroups,
    columns,
    extraActions,
    dataFilter,
    // Para testes
    test_outVialsSubmit: outMoveVialsSubmit,
  };
}
