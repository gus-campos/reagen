import { Brand } from '@/features/named-option/brand/brand.type';
import { NamedOptionView } from '@/features/named-option/named-option.view';
import { Package } from '@/features/package/package.type';
import { useData } from '@/providers/data.provider';
import { useDependencyInjection } from '@/providers/di.provider';
import { findPackagesOfBrand } from '@/shared/utils/misc';

export function BrandsView() {
  const { brandService } = useDependencyInjection();
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
    <NamedOptionView
      loadingData={loadingBrands}
      datas={brands}
      dataName="Marca"
      repositoryService={brandService}
      getDeleteWarning={getWarning}
    />
  );
}
