import { useState } from 'react';
import { TableCrudOperations } from '../../data-table/types/TableCrudOperations';
import { Package } from '../types/package';
import { ViewMode } from '../views/PackageView';

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
    handleClickRow: handleClickRow,
  };

  return {
    mode,
    selectedPackage: selectedPackage,
    handleSelectPackage: (pkg: Package | null) => setSelectedPackage(pkg),
    handleChangeMode: (mode: ViewMode) => setMode(mode),
    crudOperations,
  };
}
