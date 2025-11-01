'use client';

import { NameDataView } from '@/src/shared/components/NameDataView';
import { findItemsOfBrand, findItemsOfSupplier } from '@/src/shared/utils/misc';
import { useData } from '../../../providers/DataProvider';
import { BrandService } from '../../brands/services/BrandService';
import { Item } from '../../items/types/item';
import { SupplierService } from '../services/SupplierService';
import { Supplier } from '../types/supplier';

export function SupplierView() {
  const { suppliers, loadingSuppliers, items } = useData();

  const getWarning = (supplier: Supplier) => {
    const relatedItems = findItemsOfSupplier(supplier, items!);
    if (relatedItems.length === 0) return null;
    return generateWarning(supplier, relatedItems);
  };

  const generateWarning = (supplier: Supplier, relatedItems: Item[]) => {
    const message = `Excluir o fornecedor: ${supplier.name}
          Causará a exclusão dos seguintes itens:
          ${relatedItems.map((item) => `* ${item.id}`).join('\n')}
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
