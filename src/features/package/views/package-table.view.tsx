'use client';

import { LoadingOverlay } from '@mantine/core';
import { DataTable } from '@/features/data-table/data-table.view';
import { Package } from '@/features/package/package.type';
import { PackageVialsTable } from '@/features/package/views/package-vials-table.view';
import { usePackageTable, PackageTableProps } from '@/features/package/views/package-table.viewmodel';

export type { PackageTableProps };

export function PackageTable(props: PackageTableProps) {
  const {
    packagesError,
    loadingPackages,
    allowedPkgs,
    initialCollumns,
    dataFilter,
    mergedCrudOperations,
    getReagentById,
  } = usePackageTable(props);

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
