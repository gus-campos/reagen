import { useFundingSourcesView } from '@/features/named-option/funding-source/funding-source.viewmodel';
import { NamedOptionView } from '@/features/named-option/named-option.view';
import { useDependencyInjection } from '@/providers/dependency-injection.provider';

export function FundingSourceView() {
  const { fundingSourceService } = useDependencyInjection();
  const { fundingSources, loadingFundingSources, getWarning } = useFundingSourcesView();

  return (
    <NamedOptionView
      loadingData={loadingFundingSources}
      datas={fundingSources}
      dataName="Adquirente"
      repositoryService={fundingSourceService}
      getDeleteWarning={getWarning}
    />
  );
}
