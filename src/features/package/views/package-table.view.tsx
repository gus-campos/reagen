'use client';

import { LoadingOverlay } from '@mantine/core';
import { DataTable } from '@/features/data-table/data-table.view';
import { Package } from '@/features/package/package.type';
import { PackageVialsTable } from '@/features/package/views/package-vials-table.view';
import { usePackageTable } from '@/features/package/views/package-table.viewmodel';
import { useDependencyInjection } from '@/providers/dependency-injection.provider';
import { StockFilter } from '@/features/stock-filter/stock-filter.type';
import { TableCrudOperations } from '@/features/data-table/data-table.type';

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
