'use client';

import { NamedOptionView } from '@/features/named-option/named-option.view';
import { useSupplierView } from '@/features/named-option/supplier/supplier.viewmodel';
import { useDependencyInjection } from '@/providers/dependency-injection.provider';

export function SupplierView() {
  const { supplierService } = useDependencyInjection();
  const { suppliers, loadingSuppliers, getWarning } = useSupplierView();

  return (
    <NamedOptionView
      loadingData={loadingSuppliers}
      datas={suppliers}
      dataName="Fornecedor"
      repositoryService={supplierService}
      getDeleteWarning={getWarning}
    />
  );
}
