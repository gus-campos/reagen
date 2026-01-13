'use client';

import { NameDataView } from '@/src/shared/components/NameDataView';
import { findVialsOfSupplier } from '@/src/shared/utils/misc';
import { useData } from '../../providers/DataProvider';
import { Vial } from '../vials/types/vial';
import { Supplier } from './supplier';
import { SupplierService } from './SupplierService';

export function SupplierView() {
  const { suppliers, loadingSuppliers, vials } = useData();

  const getWarning = (supplier: Supplier) => {
    const relatedVials = findVialsOfSupplier(supplier, vials!);
    if (relatedVials.length === 0) return null;
    return generateWarning(supplier, relatedVials);
  };

  const generateWarning = (supplier: Supplier, relatedVials: Vial[]) => {
    const message = `Excluir o fornecedor: ${supplier.name}
          Causará a exclusão dos seguintes itens:
          ${relatedVials.map((vial) => `* ${vial.id}`).join('\n')}
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
