'use client';

import { useData } from '@/src/providers/data.provider';
import { NameDataView } from '@/src/shared/components/NameDataView';
import { findPackagesOfSupplier } from '@/src/shared/utils/misc';
import { Package } from '../package/package.type';
import { SupplierService } from './supplier.service';
import { Supplier } from './supplier.type';

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
