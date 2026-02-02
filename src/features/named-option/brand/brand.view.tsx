import { useFundingSourcesView } from '@/features/named-option/brand/brand.viewmodel';
import { NamedOptionView } from '@/features/named-option/named-option.view';
import { useDependencyInjection } from '@/providers/dependency-injection.provider';

export function FundingSourceView() {
  const { fundingSourceService } = useDependencyInjection();
  const { fundingSources, loadingBrands, getWarning } = useFundingSourcesView();

  return (
    <NamedOptionView
      loadingData={loadingBrands}
      datas={fundingSources}
      dataName="Marca"
      repositoryService={fundingSourceService}
      getDeleteWarning={getWarning}
    />
  );
}
