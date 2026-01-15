'use client';

import { NamedOptionView } from '@/features/named-option/named-option.view';
import { useLaboratoryView } from '@/features/named-option/laboratory/laboratory.viewmodel';
import { useDependencyInjection } from '@/providers/dependency-injection.provider';

export function LaboratoryView() {
  const { laboratoryService } = useDependencyInjection();
  const { laboratories, loadingLaboratories, getWarning } = useLaboratoryView();

  return (
    <NamedOptionView
      dataName="Laboratório"
      repositoryService={laboratoryService}
      datas={laboratories}
      loadingData={loadingLaboratories}
      getDeleteWarning={getWarning}
    />
  );
}
