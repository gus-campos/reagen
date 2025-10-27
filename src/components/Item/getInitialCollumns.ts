import { Brand } from '@/src/models/brand';
import { ControlAgency } from '@/src/models/control-agency';
import { Item } from '@/src/models/item';
import { Reagent } from '@/src/models/reagent';
import { formattedSize } from '@/src/utils/formatted-amount';
import { formattedDate } from '@/src/utils/formatted-date';
import { normalizedAmount } from '@/src/utils/normalized-amount';
import { TableCollumn } from '../Crud/Table/TableView';

export function getInitialCollumns(
  getReagentById: (id: string) => Reagent | null,
  getBrandById: (id: string) => Brand | null,
  getControlAgencyById: (id: string) => ControlAgency | null
): TableCollumn<Item>[] {
  const getAgencyName = (item: Item) => {
    const reagent = getReagentById(item.reagentId)!;
    const controlAgency = reagent.controlAgencyId
      ? getControlAgencyById(reagent.controlAgencyId)!
      : null;
    return controlAgency?.name ?? '--';
  };

  return [
    {
      name: 'Reagente',
      accessor: (item: Item) => getReagentById(item.reagentId)?.name ?? 'ND',
      fixed: true,
      sorter: (a: Item, b: Item) =>
        (getReagentById(a.reagentId)?.name ?? '')
          .trim()
          .localeCompare((getReagentById(b.reagentId)?.name ?? '').trim()),
      sortingPriority: 0,
    },
    {
      name: 'Tamanho',
      accessor: (item: Item) => formattedSize(item.size),
      fixed: false,
      sorter: (a: Item, b: Item) => {
        const unitsDiff = a.size.unit.trim().localeCompare(b.size.unit.trim());
        return unitsDiff === 0 ? normalizedAmount(a) - normalizedAmount(b) : unitsDiff;
      },
      sortingPriority: null,
    },
    {
      name: 'Pureza',
      accessor: (item: Item) => (item.purity ? `${item.purity} %` : ''),
      fixed: false,
      sorter: (a: Item, b: Item) => a.purity - b.purity,
      sortingPriority: null,
    },
    {
      name: 'Marca',
      accessor: (item: Item) => (item.brandId ? getBrandById(item.brandId)!.name : '--'),
      fixed: true,
      sorter: (a: Item, b: Item) =>
        (a.brandId ? getBrandById(a.brandId)!.name : '--')
          .trim()
          .localeCompare(b.brandId ? getBrandById(b.brandId)!.name : '--'),
      sortingPriority: 0,
    },
    {
      name: 'Orgão de controle',
      accessor: (item: Item) => getAgencyName(item),
      fixed: true,
      sorter: (a: Item, b: Item) => getAgencyName(a).trim().localeCompare(getAgencyName(b)),
      sortingPriority: 0,
    },
    {
      name: 'Vencimeto',
      accessor: (item: Item) => formattedDate(item.expireDate),
      fixed: false,
      sorter: (a: Item, b: Item) =>
        (a.expireDate?.getTime() ?? Infinity) - (b.expireDate?.getTime() ?? Infinity),
      sortingPriority: null,
    },
  ];
}
