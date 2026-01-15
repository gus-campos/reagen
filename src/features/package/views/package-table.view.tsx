'use client';

import { LoadingOverlay } from '@mantine/core';
import { TableCrudOperations } from '@/features/data-table/data-table.type';
import { DataTable } from '@/features/data-table/data-table.view';
import { Package } from '@/features/package/package.type';
import { usePackageTable } from '@/features/package/views/package-table.viewmodel';
import { PackageVialsTable } from '@/features/package/views/package-vials-table.view';
import { StockFilter } from '@/features/stock-filter/stock-filter.type';
import { useDependencyInjection } from '@/providers/dependency-injection.provider';

export type PackageTableProps = {
  filter?: StockFilter;
  search?: string;
  crudOperations?: TableCrudOperations<Package>;
};

export function PackageTable(props: PackageTableProps) {
  const { packageService } = useDependencyInjection();
  const {
    packagesError,
    loadingPackages,
    allowedPkgs,
    initialCollumns,
    dataFilter,
    mergedCrudOperations,
    getReagentById,
  } = usePackageTable({ ...props, packageService });

  return (
    <>
      {packagesError ? (
        <p>ERRO</p>
      ) : loadingPackages ? (
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
