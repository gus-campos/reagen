'use client';

import { Package } from '@/features/package/package.type';
import { SupplierService } from '@/features/supplier/supplier.service';
import { Supplier } from '@/features/supplier/supplier.type';
import { useData } from '@/providers/data.provider';
import { NameDataView } from '@/shared/components/NameDataView';
import { findPackagesOfSupplier } from '@/shared/utils/misc';

export function SupplierView() {
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
    <NameDataView
      loadingData={loadingSuppliers}
      datas={suppliers}
      dataName="Fornecedores"
      dataService={SupplierService.instance}
      getDeleteWarning={getWarning}
    />
  );
}
