import { FundingSource } from '@/features/named-option/funding-source/funding-source.type';
import { Package } from '@/features/package/package.type';
import { useData } from '@/providers/data.provider';
import { findPackagesOfFundingSource } from '@/shared/utils/misc';

export function useFundingSourcesView() {
  const { fundingSources, packages, loadingFundingSources } = useData();

  const generateWarning = (fundingSource: FundingSource, relatedPkgs: Package[]) => {
    const message = `Excluir o adquirente: ${fundingSource.name}
          Causará a exclusão dos seguintes pacotes:
          ${relatedPkgs.map((pkg) => `* ${pkg.id}`).join('\n')}
          `;

    return message;
  };

  const getWarning = (fundingSource: FundingSource) => {
    const relatedPkgs = findPackagesOfFundingSource(fundingSource, packages!);
    if (relatedPkgs.length === 0) return null;
    return generateWarning(fundingSource, relatedPkgs);
  };

  return {
    fundingSources,
    loadingFundingSources,
    getWarning,
  };
}
