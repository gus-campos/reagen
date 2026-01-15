'use client';

import { NamedOptionView } from '@/features/named-option/named-option.view';
import { useLaboratoryView } from '@/features/named-option/laboratory/laboratory.viewmodel';

export function LaboratoryView() {
  const { laboratoryService, laboratories, loadingLaboratories, getWarning } = useLaboratoryView();

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
