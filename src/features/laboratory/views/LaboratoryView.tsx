'use client';

import { useData } from '@/src/providers/DataProvider';
import { NameDataView } from '@/src/shared/components/NameDataView';
import { findItemsOfLaboratory } from '@/src/shared/utils/misc';
import { ControlAgencyService } from '../../control-agency/services/ControlAgencyService';
import { Item } from '../../items/types/item';
import { LaboratoryService } from '../services/LaboratoryService';
import { Laboratory } from '../types/laboratory';

export function LaboratoryView() {
  const { laboratories, loadingLaboratories, items } = useData();

  const getWarning = (laboratory: Laboratory) => {
    const relatedItems = findItemsOfLaboratory(laboratory, items!);
    if (relatedItems.length === 0) return null;
    return generateWarning(laboratory, relatedItems);
  };

  const generateWarning = (laboratory: Laboratory, relatedItems: Item[]) => {
    const message = `Excluir o laboratório: ${laboratory.name}
          Causará a exclusão dos seguintes items:
          ${relatedItems.map((i) => `* ${i.id}`).join('\n')}
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
