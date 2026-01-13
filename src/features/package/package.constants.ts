import { Brand } from '@/src/features/brand/brand.type';
import { ControlAgency } from '@/src/features/control-agency/control-agency.type';
import { Reagent } from '@/src/features/reagent/reagent.type';
import { formattedDate } from '@/src/shared/utils/formatted-date';
import { TableCollumn } from '../data-table/data-table.type';
import { Laboratory } from '../laboratory/laboratory.type';
import { formattedSize, normalizedAmount } from '../size/size.util';
import { Supplier } from '../supplier/supplier.type';
import { Package } from './package.type';

export type PackageCollumGetters = {
  getPackageById: (id: string) => Package;
  getReagentById: (id: string) => Reagent;
  getBrandById: (id: string) => Brand;
  getControlAgencyById: (id: string) => ControlAgency;
  getLaboratoryById: (id: string) => Laboratory;
  getSupplierById: (id: string) => Supplier;
};

export function getInitialCollumns(getters: PackageCollumGetters): TableCollumn<Package>[] {
  /* Retorna as colunas da tabela de packages. */

  // Funções de acesso usando os getters
  const getReagentName = (pkg: Package) => getters.getReagentById(pkg.reagentId)?.name ?? 'ND';

  const getSize = (pkg: Package) => pkg.size;

  const getSizeFormatted = (pkg: Package) => formattedSize(getSize(pkg));

  const getPurity = (pkg: Package) => `${pkg.purity} %`;

  const getBrandName = (pkg: Package) =>
    pkg.brandId ? getters.getBrandById(pkg.brandId).name : '--';

  // const getLaboratoryName = (pkg: Package) =>
  //   pkg.laboratoryId ? getters.getLaboratoryById(pkg.laboratoryId).name : '--';

  const getSupplierName = (pkg: Package) =>
    pkg.supplierId ? getters.getSupplierById(pkg.supplierId).name : '--';

  const getExpireDate = (pkg: Package) => formattedDate(pkg.expireDate);

  const getInDate = (pkg: Package) => formattedDate(pkg.inDate);

  // FIXME: defaultSortedCollum: true
  const allCollumns = [
    {
      name: 'Reagente',
      accessor: (pkg: Package) => getReagentName(pkg),
      sorter: (a: Package, b: Package) =>
        getReagentName(a).trim().localeCompare(getReagentName(b).trim()),
      fixed: true,
      sortingPriority: 0,
    },
    {
      name: 'Tamanho',
      accessor: (pkg: Package) => getSizeFormatted(pkg),
      sorter: (a: Package, b: Package) => {
        const unitsDiff = getSize(a).unit.trim().localeCompare(getSize(b).unit.trim());
        return unitsDiff === 0
          ? normalizedAmount(getSize(a)) - normalizedAmount(getSize(b))
          : unitsDiff;
      },
      fixed: false,
      sortingPriority: null,
    },
    {
      name: 'Pureza',
      accessor: (pkg: Package) => getPurity(pkg),
      sorter: (a: Package, b: Package) => a.purity - b.purity,
      fixed: false,
      sortingPriority: null,
    },
    {
      name: 'Marca',
      accessor: (pkg: Package) => getBrandName(pkg),
      sorter: (a: Package, b: Package) =>
        getBrandName(a).trim().localeCompare(getBrandName(b).trim()),
      fixed: false,
      sortingPriority: 0,
    },
    // {
    //   name: 'Laboratório',
    //   accessor: (pkg: Package) => getLaboratoryName(pkg),
    //   sorter: (a: Package, b: Package) =>
    //     getLaboratoryName(a).trim().localeCompare(getLaboratoryName(b).trim()),
    //   fixed: false,
    //   sortingPriority: 0,
    // },
    {
      name: 'Fornecedor',
      accessor: (pkg: Package) => getSupplierName(pkg),
      sorter: (a: Package, b: Package) =>
        getSupplierName(a).trim().localeCompare(getSupplierName(b).trim()),
      fixed: false,
      sortingPriority: 0,
    },
    {
      name: 'Entrada',
      accessor: (pkg: Package) => getExpireDate(pkg),
      sorter: (a: Package, b: Package) =>
        (a.expireDate?.getTime() ?? Infinity) - (b.expireDate?.getTime() ?? Infinity),
      fixed: false,
      sortingPriority: null,
    },
    {
      name: 'Vencimento',
      accessor: (pkg: Package) => getInDate(pkg),
      sorter: (a: Package, b: Package) =>
        (a.inDate?.getTime() ?? Infinity) - (b.inDate?.getTime() ?? Infinity),
      fixed: false,
      sortingPriority: null,
    },
  ];

  return allCollumns;
}
