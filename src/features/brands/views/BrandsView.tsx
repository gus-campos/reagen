'use client';

import { NameDataView } from '@/src/shared/components/NameDataView';
import { findItemsOfBrand } from '@/src/shared/utils/misc';
import { useData } from '../../../providers/DataProvider';
import { Item } from '../../items/types/item';
import { BrandService } from '../services/BrandService';
import { Brand } from '../types/brand';

export function BrandsView() {
  const { brands, items, loadingBrands } = useData();

  const getWarning = (brand: Brand) => {
    const relatedItems = findItemsOfBrand(brand, items!);
    if (relatedItems.length === 0) return null;
    return generateWarning(brand, relatedItems);
  };

  const generateWarning = (brand: Brand, relatedItems: Item[]) => {
    const message = `Excluir a marca: ${brand.name}
          Causará a exclusão dos seguintes itens:
          ${relatedItems.map((item) => `* ${item.id}`).join('\n')}
          `;

    return message;
  };

  return (
    <NameDataView
      loadingData={loadingBrands}
      datas={brands}
      dataName="Marca"
      dataService={BrandService.instance}
      getDeleteWarning={getWarning}
    />
  );
}
