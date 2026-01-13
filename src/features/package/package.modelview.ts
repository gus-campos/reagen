import { useState } from 'react';
import { TableCrudOperations } from '@/features/data-table/data-table.type';
import { Package } from '@/features/package/package.type';
import { ViewMode } from '@/features/package/package.view';

export function usePackageView() {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [mode, setMode] = useState<ViewMode>('table');

  const handleClickRow = (pkg: Package) => {
    setSelectedPackage(pkg);
    setMode('show');
  };

  const handleBeginPackageEdit = (pkg: Package) => {
    setSelectedPackage(pkg);
    setMode('edit');
  };

  const crudOperations: TableCrudOperations<Package> = {
    handleBeginDataEdit: handleBeginPackageEdit,
    handleClickRow,
  };

  return {
    mode,
    selectedPackage,
    handleSelectPackage: (pkg: Package | null) => setSelectedPackage(pkg),
    handleChangeMode: (mode: ViewMode) => setMode(mode),
    crudOperations,
  };
}
