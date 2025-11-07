import { Brand } from '@/src/features/brands/types/brand';
import { ControlAgency } from '@/src/features/control-agency/types/control-agency';
import { Item } from '@/src/features/items/types/item';
import { Reagent } from '@/src/features/reagents/types/reagent';
import { formattedSize } from '@/src/features/reagents/utils/formatted-amount';
import { normalizedAmount } from '@/src/features/reagents/utils/normalized-amount';
import { formattedDate } from '@/src/shared/utils/formatted-date';
import { TableCollumn } from '../../data-table/types/TableCollumn';
import { Laboratory } from '../../laboratory/types/laboratory';
import { Supplier } from '../../supplier/types/supplier';

export type ItemCollumGetters = {
  getReagentById: (id: string) => Reagent;
  getBrandById: (id: string) => Brand;
  getControlAgencyById: (id: string) => ControlAgency;
  getLaboratoryById: (id: string) => Laboratory;
  getSupplierById: (id: string) => Supplier;
};

export function getInitialCollumns(getters: ItemCollumGetters): TableCollumn<Item>[] {
  /* Retorna as colunas da tabela de items. O parâmetro `isGroupTableItems` quando passado,
  permite obter um subconjunto das colunas, especialmente para a sub tabela de items da 
  visualização agrupada. */

  // const getAgencyName = (item: Item) => {
  //   const reagent = getters.getReagentById(item.reagentId);
  //   const controlAgency = reagent.controlAgencyId
  //     ? getters.getControlAgencyById(reagent.controlAgencyId)
  //     : null;
  //   return controlAgency?.name ?? '--';
  // };

  const getLaboratoryName = (item: Item) => {
    return item.laboratoryId ? getters.getLaboratoryById(item.laboratoryId).name : '--';
  };

  const getSupplierName = (item: Item) => {
    return item.supplierId ? getters.getSupplierById(item.supplierId).name : '--';
  };

  // FIXME: defaultSortedCollum: true
  const allCollumns = [
    {
      name: 'Reagente',
      accessor: (item: Item) => getters.getReagentById(item.reagentId)?.name ?? 'ND',
      fixed: true,
      sorter: (a: Item, b: Item) =>
        (getters.getReagentById(a.reagentId)?.name ?? '')
          .trim()
          .localeCompare((getters.getReagentById(b.reagentId)?.name ?? '').trim()),
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
      accessor: (item: Item) => (item.brandId ? getters.getBrandById(item.brandId).name : '--'),
      fixed: false,
      sorter: (a: Item, b: Item) =>
        (a.brandId ? getters.getBrandById(a.brandId).name : '--')
          .trim()
          .localeCompare(b.brandId ? getters.getBrandById(b.brandId).name : '--'),
      sortingPriority: 0,
    },
    // {
    //   name: 'Orgão de controle',
    //   accessor: (item: Item) => getAgencyName(item),
    //   fixed: false,
    //   sorter: (a: Item, b: Item) => getAgencyName(a).trim().localeCompare(getAgencyName(b)),
    //   sortingPriority: 0,
    // },
    {
      name: 'Laboratório',
      accessor: (item: Item) => getLaboratoryName(item),
      fixed: false,
      sorter: (a: Item, b: Item) =>
        getLaboratoryName(a).trim().localeCompare(getLaboratoryName(a).trim()),
      sortingPriority: 0,
    },
    {
      name: 'Fornecedor',
      accessor: (item: Item) => getSupplierName(item),
      fixed: false,
      sorter: (a: Item, b: Item) =>
        getSupplierName(a).trim().localeCompare(getSupplierName(a).trim()),
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

  return allCollumns;
}

export function getSubGroupInitialCollumns(getters: ItemCollumGetters): TableCollumn<Item>[] {
  const allowedCollumnNames = ['Pureza', 'Marca', 'Laboratório', 'Fornecedor', 'Vencimeto'];

  const allCollumns = getInitialCollumns(getters);
  return allowedCollumnNames.map((name) => allCollumns.find((col) => col.name === name)!);
}
