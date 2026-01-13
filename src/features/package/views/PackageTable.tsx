'use client';

import { LoadingOverlay } from '@mantine/core';
import { TableCrudOperations } from '@/src/features/data-table/types/TableCrudOperations';
import { useData } from '@/src/providers/DataProvider';
import { DataTable } from '../../data-table/components/DataTable';
import { filteredPackage } from '../../filter/filtered-package';
import { StockFilter } from '../../filter/stock-filter';
import { getInitialCollumns, PackageCollumGetters } from '../constants/getInitialCollumns';
import { PackageService } from '../services/PackageService';
import { Package } from '../types/package';
import { PackageVialsTable } from './PackageVialsTable';

export type PackageTableProps = {
  filter?: StockFilter;
  search?: string;
  crudOperations?: TableCrudOperations<Package>;
};

export function PackageTable(props: PackageTableProps) {
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

  // HANDLERS

  const handleDeletePackage = (pkg: Package) => {
    PackageService.instance.delete(pkg.id);
  };

  const crudOperations: TableCrudOperations<Package> = {
    handleDeleteData: handleDeletePackage,
  };

  const mergedCrudOperations = { ...crudOperations, ...props.crudOperations };

  const allowedPkgs = packages ?? [];

  const dataFilter = props.filter
    ? (pkg: Package) => filteredPackage(pkg, props.filter!, getReagentById)
    : undefined;

  return (
    <>
      {packagesError ? (
        <p>ERRO</p>
      ) : loadingPackages ? (
        // TODO: Inserir skeletons
        <LoadingOverlay visible />
      ) : (
        <DataTable<Package>
          datas={allowedPkgs}
          collumns={initialCollumns}
          search={props.search}
          searched={(pkg: Package) => getReagentById(pkg.reagentId).name}
          dataFilter={dataFilter}
          crudOperations={mergedCrudOperations}
          getExpandedComponent={(data) => <PackageVialsTable data={data} filter={props.filter} />}
        />
      )}
    </>
  );
}
