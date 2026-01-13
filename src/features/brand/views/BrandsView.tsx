'use client';

import { NameDataView } from '@/src/shared/components/NameDataView';
import { findPackagesOfBrand } from '@/src/shared/utils/misc';
import { useData } from '../../../providers/DataProvider';
import { Package } from '../../package/types/package';
import { BrandService } from '../services/BrandService';
import { Brand } from '../types/brand';

export function BrandsView() {
  const { brands, packages, loadingBrands } = useData();

  const getWarning = (brand: Brand) => {
    const relatedPkgs = findPackagesOfBrand(brand, packages!);
    if (relatedPkgs.length === 0) return null;
    return generateWarning(brand, relatedPkgs);
  };

  const generateWarning = (brand: Brand, relatedPkgs: Package[]) => {
    const message = `Excluir a marca: ${brand.name}
          Causará a exclusão dos seguintes pacotes:
          ${relatedPkgs.map((pkg) => `* ${pkg.id}`).join('\n')}
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
