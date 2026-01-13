'use client';

import { LaboratoryService } from '@/features/laboratory/laboratory.service';
import { Laboratory } from '@/features/laboratory/laboratory.type';
import { Vial } from '@/features/vial/vial.type';
import { useData } from '@/providers/data.provider';
import { NameDataView } from '@/shared/components/NameDataView';
import { findVialsOfLaboratory } from '@/shared/utils/misc';

export function LaboratoryView() {
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
    <NameDataView
      dataName="Orgão de Controle"
      dataService={LaboratoryService.instance}
      datas={laboratories}
      loadingData={loadingLaboratories}
      getDeleteWarning={getWarning}
    />
  );
}
