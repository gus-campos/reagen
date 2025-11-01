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

export function getInitialCollumns(
  getReagentById: (id: string) => Reagent,
  getBrandById: (id: string) => Brand,
  getControlAgencyById: (id: string) => ControlAgency,
  getLaboratoryById: (id: string) => Laboratory,
  getSupplierById: (id: string) => Supplier
): TableCollumn<Item>[] {
  const getAgencyName = (item: Item) => {
    const reagent = getReagentById(item.reagentId);
    const controlAgency = reagent.controlAgencyId
      ? getControlAgencyById(reagent.controlAgencyId)
      : null;
    return controlAgency?.name ?? '--';
  };

  const getLaboratoryName = (item: Item) => {
    return item.laboratoryId ? getLaboratoryById(item.laboratoryId).name : '--';
  };

  const getSupplierName = (item: Item) => {
    return item.supplierId ? getSupplierById(item.supplierId).name : '--';
  };

  // console.log('lab by id', getLaboratoryById('J8FAdboCepvhwTiuwf44'));

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
      accessor: (item: Item) => (item.brandId ? getBrandById(item.brandId).name : '--'),
      fixed: true,
      sorter: (a: Item, b: Item) =>
        (a.brandId ? getBrandById(a.brandId).name : '--')
          .trim()
          .localeCompare(b.brandId ? getBrandById(b.brandId).name : '--'),
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
      name: 'Laboratório',
      accessor: (item: Item) => getLaboratoryName(item),
      fixed: true,
      sorter: (a: Item, b: Item) =>
        getLaboratoryName(a).trim().localeCompare(getLaboratoryName(a).trim()),
      sortingPriority: 0,
    },
    {
      name: 'Fornecedor',
      accessor: (item: Item) => getSupplierName(item),
      fixed: true,
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
}
