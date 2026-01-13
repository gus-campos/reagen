'use client';

import { useData } from '@/src/providers/data.provider';
import { NameDataView } from '@/src/shared/components/NameDataView';
import { findVialsOfLaboratory } from '@/src/shared/utils/misc';
import { Vial } from '../vial/vial.type';
import { LaboratoryService } from './laboratory.service';
import { Laboratory } from './laboratory.type';

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
