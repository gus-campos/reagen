'use client';

import { useData } from '@/src/providers/DataProvider';
import { NameDataView } from '@/src/shared/components/NameDataView';
import { findItemsOfControlAgency, findReagentsOfControlAgency } from '@/src/shared/utils/misc';
import { Item } from '../../items/types/item';
import { Reagent } from '../../reagents/types/reagent';
import { ControlAgencyService } from '../services/ControlAgencyService';
import { ControlAgency } from '../types/control-agency';

export function ControlAgenciesView() {
  const { controlAgencies, loadingControlAgencies, reagents, items } = useData();

  const getWarning = (controlAgency: ControlAgency) => {
    const relatedReagents = findReagentsOfControlAgency(controlAgency, reagents!);
    if (relatedReagents.length === 0) return null;
    const relatedItems = findItemsOfControlAgency(controlAgency, reagents!, items!);
    return generateWarning(controlAgency, relatedReagents, relatedItems);
  };

  const generateWarning = (
    controlAgency: ControlAgency,
    relatedReagents: Reagent[],
    relatedItems: Item[]
  ) => {
    const reagentsMessage = `Excluir o orgão de controle: ${controlAgency.name}
          Causará a exclusão dos seguintes reagentes:
          ${relatedReagents.map((reag) => `* ${reag.name}`).join('\n')}
          `;

    const itemsMessage =
      relatedItems.length > 0
        ? `Que por consequência causará a exclusão dos seguintes itens:
          ${relatedItems.map((item) => `* ${item.id}`).join('\n')}`
        : '';

    return reagentsMessage + itemsMessage;
  };

  return (
    <NameDataView
      dataName="Orgão de Controle"
      dataService={ControlAgencyService.instance}
      datas={controlAgencies}
      loadingData={loadingControlAgencies}
      getDeleteWarning={getWarning}
    />
  );
}
