'use client';

import { NamedOptionView } from '@/features/named-option/named-option.view';
import { useControlAgenciesView } from '@/features/named-option/control-agency/control-agency.viewmodel';
import { useDependencyInjection } from '@/providers/dependency-injection.provider';

export function ControlAgenciesView() {
  const { controlAgencyService } = useDependencyInjection();
  const { controlAgencies, loadingControlAgencies, getWarning } =
    useControlAgenciesView();

  return (
    <NamedOptionView
      dataName="Orgão de Controle"
      repositoryService={controlAgencyService}
      datas={controlAgencies}
      loadingData={loadingControlAgencies}
      getDeleteWarning={getWarning}
    />
  );
}
