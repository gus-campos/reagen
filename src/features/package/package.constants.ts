import { TableCollumn } from '@/features/data-table/data-table.type';
import { ControlAgency } from '@/features/named-option/control-agency/control-agency.type';
import { FundingSource } from '@/features/named-option/funding-source/funding-source.type';
import { Laboratory } from '@/features/named-option/laboratory/laboratory.type';
import { Supplier } from '@/features/named-option/supplier/supplier.type';
import { Package } from '@/features/package/package.type';
import { Reagent } from '@/features/reagent/reagent.type';
import { formattedSize, normalizedAmount } from '@/features/size/size.util';
import { formattedDate } from '@/shared/utils/formatted-date';

export type PackageCollumGetters = {
  getPackageById: (id: string) => Package;
  getReagentById: (id: string) => Reagent;
  getFundingSourceById: (id: string) => FundingSource;
  getControlAgencyById: (id: string) => ControlAgency;
  getLaboratoryById: (id: string) => Laboratory;
  getSupplierById: (id: string) => Supplier;
};

export function getPackageInitialCollumns(getters: PackageCollumGetters): TableCollumn<Package>[] {
  /* Retorna as colunas da tabela de packages. */

  // Funções de acesso usando os getters
  const getReagentName = (pkg: Package) => getters.getReagentById(pkg.reagentId)?.name ?? 'ND';

  const getSize = (pkg: Package) => pkg.size;

  const getSizeFormatted = (pkg: Package) => formattedSize(getSize(pkg));

  const getPurity = (pkg: Package) => `${pkg.purity} %`;

  const getFundingSourceName = (pkg: Package) =>
    pkg.fundingSourceId ? getters.getFundingSourceById(pkg.fundingSourceId).name : '--';

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
    },
    {
      name: 'Pureza',
      accessor: (pkg: Package) => getPurity(pkg),
      sorter: (a: Package, b: Package) => a.purity - b.purity,
      fixed: false,
    },
    {
      name: 'Adquirente',
      accessor: (pkg: Package) => getFundingSourceName(pkg),
      sorter: (a: Package, b: Package) =>
        getFundingSourceName(a).trim().localeCompare(getFundingSourceName(b).trim()),
      fixed: false,
    },
    // {
    //   name: 'Laboratório',
    //   accessor: (pkg: Package) => getLaboratoryName(pkg),
    //   sorter: (a: Package, b: Package) =>
    //     getLaboratoryName(a).trim().localeCompare(getLaboratoryName(b).trim()),
    //   fixed: false,
    // },
    {
      name: 'Fornecedor',
      accessor: (pkg: Package) => getSupplierName(pkg),
      sorter: (a: Package, b: Package) =>
        getSupplierName(a).trim().localeCompare(getSupplierName(b).trim()),
      fixed: false,
    },
    {
      name: 'Entrada',
      accessor: (pkg: Package) => getInDate(pkg),
      sorter: (a: Package, b: Package) =>
        (a.expireDate?.getTime() ?? Infinity) - (b.expireDate?.getTime() ?? Infinity),
      fixed: false,
    },
    {
      name: 'Vencimento',
      accessor: (pkg: Package) => getExpireDate(pkg),
      sorter: (a: Package, b: Package) =>
        (a.inDate?.getTime() ?? Infinity) - (b.inDate?.getTime() ?? Infinity),
      fixed: false,
    },
  ];

  return allCollumns;
}
