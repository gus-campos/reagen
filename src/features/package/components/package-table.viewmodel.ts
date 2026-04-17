import { useState } from 'react';
import { TableCrudOperations } from '@/features/data-table/data-table.type';
import { PackageTableProps } from '@/features/package/components/package-table.view';
import {
  getPackageInitialCollumns,
  PackageCollumGetters,
} from '@/features/package/package.constants';
import { PackageService } from '@/features/package/package.service';
import { Package } from '@/features/package/package.type';
import { formattedSize } from '@/features/size/size.util';
import { filteredPackage } from '@/features/stock-filter/stock-filter.util';
import { Vial } from '@/features/vial/vial.type';
import { useData } from '@/providers/data.provider';
import { findVialsOfPackage } from '@/shared/utils/findEntities';

type UsePackageTableProps = PackageTableProps & {
  packageService: PackageService;
};

export function usePackageTable(props: UsePackageTableProps) {
  const {
    vials,
    packages,
    loadingPackages,
    packagesError,
    getPackageById,
    getReagentById,
    getFundingSourceById,
    getControlAgencyById,
    getLaboratoryById,
    getSupplierById,
  } = useData();

  const getters: PackageCollumGetters = {
    getPackageById,
    getReagentById,
    getFundingSourceById,
    getControlAgencyById,
    getLaboratoryById,
    getSupplierById,
  };

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>();

  const exitConfirmModal = () => setConfirmModalOpen(false);

  const handleStartDeletePackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setConfirmModalOpen(true);
  };

  const handleDeletePackage = () => {
    if (selectedPackage) props.packageService.delete(selectedPackage.id);
  };

  const crudOperations: TableCrudOperations<Package> = {
    handleDeleteData: handleStartDeletePackage,
  };

  const mergedCrudOperations = { ...crudOperations, ...props.crudOperations };

  const allowedPkgs = packages ?? [];

  const dataFilter = props.filter
    ? (pkg: Package) => filteredPackage(pkg, props.filter!, vials!, getReagentById)
    : undefined;

  const generateWarning = (pkg: Package, relatedVials: Vial[]) => {
    const message = `Excluir o pacote ${getReagentById(pkg.reagentId).name} - ${formattedSize(pkg.size)},
          Causará a exclusão de seus ${relatedVials.length} frascos.`;

    return message;
  };

  const getWarning = (pkg: Package) => {
    const relatedVials = findVialsOfPackage(pkg, vials!);
    if (relatedVials.length === 0) return null;
    return generateWarning(pkg, relatedVials);
  };

  const warning = selectedPackage ? getWarning(selectedPackage) : '';

  const initialCollumns = getPackageInitialCollumns(getters);

  return {
    packagesError,
    loadingPackages,
    allowedPkgs,
    initialCollumns,
    dataFilter,
    mergedCrudOperations,
    getReagentById,
    handleDeletePackage,
    confirmModalOpen,
    exitConfirmModal,
    warning,
  };
}
