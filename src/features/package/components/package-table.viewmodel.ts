import { TableCrudOperations } from '@/features/data-table/data-table.type';
import { PackageTableProps } from '@/features/package/components/package-table.view';
import { getInitialCollumns, PackageCollumGetters } from '@/features/package/package.constants';
import { PackageService } from '@/features/package/package.service';
import { Package } from '@/features/package/package.type';
import { filteredPackage } from '@/features/stock-filter/stock-filter.util';
import { useData } from '@/providers/data.provider';

type UsePackageTableProps = PackageTableProps & {
  packageService: PackageService;
};

export function usePackageTable(props: UsePackageTableProps) {
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
    props.packageService.delete(pkg.id);
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
