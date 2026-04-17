import { Supplier } from '@/features/named-option/supplier/supplier.type';
import { Package } from '@/features/package/package.type';
import { useData } from '@/providers/data.provider';
import { findPackagesOfSupplier } from '@/shared/utils/findEntities';

export function useSupplierView() {
  const { suppliers, loadingSuppliers, packages } = useData();

  const generateWarning = (supplier: Supplier, relatedPkgs: Package[]) => {
    const message = `Excluir o fornecedor: ${supplier.name}
          Causará a exclusão dos seguintes itens:
          ${relatedPkgs.map((vial) => `* ${vial.id}`).join('\n')}
          `;

    return message;
  };

  const getWarning = (supplier: Supplier) => {
    const relatedPkg = findPackagesOfSupplier(supplier, packages!);
    if (relatedPkg.length === 0) return null;
    return generateWarning(supplier, relatedPkg);
  };

  return {
    suppliers,
    loadingSuppliers,
    getWarning,
  };
}
