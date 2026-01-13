'use client';

import { LoadingOverlay } from '@mantine/core';
import { useData } from '@/src/providers/data.provider';
import { TableCrudOperations } from '../../data-table/data-table.type';
import { DataTable } from '../../data-table/data-table.view';
import { StockFilter } from '../../stock-filter/stock-filter';
import { filteredPackage } from '../../stock-filter/stock-filter.util';
import { getInitialCollumns, PackageCollumGetters } from '../package.constants';
import { PackageService } from '../package.service';
import { Package } from '../package.type';
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
