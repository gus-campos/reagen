import { Item } from '@/src/models/item';
import { Reagent } from '@/src/models/reagent';
import { formattedAmount } from '@/src/utils/formatted-amount';
import { formattedDate } from '@/src/utils/formatted-date';
import { normalizedAmount } from '@/src/utils/normalized-amount';
import { TableCollumn } from '../Crud/Table/TableView';

export function getInitialCollumns(
  getReagentById: (id: string) => Reagent | null
): TableCollumn<Item>[] {
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
      name: 'Quantidade',
      accessor: (item: Item) => formattedAmount(item),
      fixed: false,
      sorter: (a: Item, b: Item) => normalizedAmount(a) - normalizedAmount(b),
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
      name: 'Vencimeto',
      accessor: (item: Item) => formattedDate(item.expireDate),
      fixed: false,
      sorter: (a: Item, b: Item) =>
        (a.expireDate?.getTime() ?? Infinity) - (b.expireDate?.getTime() ?? Infinity),
      sortingPriority: null,
    },
  ];
}
