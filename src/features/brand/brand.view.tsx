import { BrandService } from '@/features/brand/brand.service';
import { Brand } from '@/features/brand/brand.type';
import { Package } from '@/features/package/package.type';
import { useData } from '@/providers/data.provider';
import { NameDataView } from '@/shared/components/NameDataView';
import { findPackagesOfBrand } from '@/shared/utils/misc';

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
