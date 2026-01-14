'use client';

import { NamedOptionView } from '@/features/named-option/named-option.view';
import { Supplier } from '@/features/named-option/supplier/supplier.type';
import { Package } from '@/features/package/package.type';
import { useData } from '@/providers/data.provider';
import { useDependencyInjection } from '@/providers/dependency-injection.provider';
import { findPackagesOfSupplier } from '@/shared/utils/misc';

export function SupplierView() {
  const { supplierService } = useDependencyInjection();
  const { suppliers, loadingSuppliers, packages } = useData();

  const getWarning = (supplier: Supplier) => {
    const relatedPkg = findPackagesOfSupplier(supplier, packages!);
    if (relatedPkg.length === 0) return null;
    return generateWarning(supplier, relatedPkg);
  };

  const generateWarning = (supplier: Supplier, relatedPkgs: Package[]) => {
    const message = `Excluir o fornecedor: ${supplier.name}
          Causará a exclusão dos seguintes itens:
          ${relatedPkgs.map((vial) => `* ${vial.id}`).join('\n')}
          `;

    return message;
  };

  return (
    <NamedOptionView
      loadingData={loadingSuppliers}
      datas={suppliers}
      dataName="Fornecedores"
      repositoryService={supplierService}
      getDeleteWarning={getWarning}
    />
  );
}
