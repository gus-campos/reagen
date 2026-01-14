'use client';

import { Laboratory } from '@/features/named-option/laboratory/laboratory.type';
import { NamedOptionView } from '@/features/named-option/named-option.view';
import { Vial } from '@/features/vial/vial.type';
import { useData } from '@/providers/data.provider';
import { useDependencyInjection } from '@/providers/dependency-injection.provider';
import { findVialsOfLaboratory } from '@/shared/utils/misc';

export function LaboratoryView() {
  const { laboratoryService } = useDependencyInjection();
  const { laboratories, loadingLaboratories, vials: vials } = useData();

  const getWarning = (laboratory: Laboratory) => {
    const relatedVials = findVialsOfLaboratory(laboratory, vials!);
    if (relatedVials.length === 0) return null;
    return generateWarning(laboratory, relatedVials);
  };

  const generateWarning = (laboratory: Laboratory, relatedVials: Vial[]) => {
    const message = `Excluir o laboratório: ${laboratory.name}
          Causará a exclusão dos seguintes vials:
          ${relatedVials.map((i) => `* ${i.id}`).join('\n')}
          `;

    return message;
  };

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
