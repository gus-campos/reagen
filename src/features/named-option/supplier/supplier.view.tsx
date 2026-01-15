'use client';

import { NamedOptionView } from '@/features/named-option/named-option.view';
import { useSupplierView } from '@/features/named-option/supplier/supplier.viewmodel';

export function SupplierView() {
  const { supplierService, suppliers, loadingSuppliers, getWarning } = useSupplierView();

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
