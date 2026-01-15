import { TableCrudOperations } from '@/features/data-table/data-table.type';
import { getInitialCollumns, PackageCollumGetters } from '@/features/package/package.constants';
import { Package } from '@/features/package/package.type';
import { StockFilter } from '@/features/stock-filter/stock-filter.type';
import { filteredPackage } from '@/features/stock-filter/stock-filter.util';
import { useData } from '@/providers/data.provider';
import { useDependencyInjection } from '@/providers/dependency-injection.provider';

export type PackageTableProps = {
  filter?: StockFilter;
  search?: string;
  crudOperations?: TableCrudOperations<Package>;
};

export function usePackageTable(props: PackageTableProps) {
  const { packageService } = useDependencyInjection();
  const {
    packages,
    loadingPackages,
    packagesError,
    getPackageById,
    getReagentById,
    getBrandById,
    getControlAgencyById,
    getLaboratoryById,
    getSupplierById,
  } = useData();

  const getters: PackageCollumGetters = {
    getPackageById,
    getReagentById,
    getBrandById,
    getControlAgencyById,
    getLaboratoryById,
    getSupplierById,
  };

  const initialCollumns = getInitialCollumns(getters);

  const handleDeletePackage = (pkg: Package) => {
    packageService.delete(pkg.id);
  };

  const crudOperations: TableCrudOperations<Package> = {
    handleDeleteData: handleDeletePackage,
  };

  const mergedCrudOperations = { ...crudOperations, ...props.crudOperations };

  const allowedPkgs = packages ?? [];

  const dataFilter = props.filter
    ? (pkg: Package) => filteredPackage(pkg, props.filter!, getReagentById)
    : undefined;

  return {
    packagesError,
    loadingPackages,
    allowedPkgs,
    initialCollumns,
    dataFilter,
    mergedCrudOperations,
    getReagentById,
  };
}
