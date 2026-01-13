'use client';

import { NameDataView } from '@/src/shared/components/NameDataView';
import { findPackagesOfBrand } from '@/src/shared/utils/misc';
import { useData } from '../../providers/DataProvider';
import { Package } from '../package/types/package';
import { Brand } from './brand';
import { BrandService } from './BrandService';

export function BrandsView() {
  const { brands, packages, loadingBrands } = useData();

  const getWarning = (brand: Brand) => {
    const relatedPackages = findPackagesOfBrand(brand, packages!);
    if (relatedPackages.length === 0) return null;
    return generateWarning(brand, relatedPackages);
  };

  const generateWarning = (brand: Brand, relatedPackages: Package[]) => {
    const message = `Excluir a marca: ${brand.name}
          Causará a exclusão dos seguintes itens:
          ${relatedPackages.map((pkg) => `* ${pkg.id}`).join('\n')}
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
