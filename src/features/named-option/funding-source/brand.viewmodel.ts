import { FundingSource } from '@/features/named-option/funding-source/brand.type';
import { Package } from '@/features/package/package.type';
import { useData } from '@/providers/data.provider';
import { findPackagesOfBrand } from '@/shared/utils/misc';

export function useFundingSourcesView() {
  const { fundingSources, packages, loadingBrands } = useData();

  const generateWarning = (brand: FundingSource, relatedPkgs: Package[]) => {
    const message = `Excluir a marca: ${brand.name}
          Causará a exclusão dos seguintes pacotes:
          ${relatedPkgs.map((pkg) => `* ${pkg.id}`).join('\n')}
          `;

    return message;
  };

  const getWarning = (brand: FundingSource) => {
    const relatedPkgs = findPackagesOfBrand(brand, packages!);
    if (relatedPkgs.length === 0) return null;
    return generateWarning(brand, relatedPkgs);
  };

  return {
    fundingSources,
    loadingBrands,
    getWarning,
  };
}
