'use client';

import { useData } from '@/src/providers/DataProvider';
import { NameDataView } from '@/src/shared/components/NameDataView';
import { findPackagesOfControlAgency, findReagentsOfControlAgency } from '@/src/shared/utils/misc';
import { Package } from '../../package/types/package';
import { Reagent } from '../../reagent/types/reagent';
import { ControlAgencyService } from '../services/ControlAgencyService';
import { ControlAgency } from '../types/control-agency';

export function ControlAgenciesView() {
  const { controlAgencies, loadingControlAgencies, reagents, packages } = useData();

  const getWarning = (controlAgency: ControlAgency) => {
    const relatedReagents = findReagentsOfControlAgency(controlAgency, reagents!);
    if (relatedReagents.length === 0) return null;
    const relatedPkgs = findPackagesOfControlAgency(controlAgency, reagents!, packages!);
    return generateWarning(controlAgency, relatedReagents, relatedPkgs);
  };

  const generateWarning = (
    controlAgency: ControlAgency,
    relatedReagents: Reagent[],
    relatedPkgs: Package[]
  ) => {
    const reagentsMessage = `Excluir o orgão de controle: ${controlAgency.name}
          Causará a exclusão dos seguintes reagentes:
          ${relatedReagents.map((reag) => `* ${reag.name}`).join('\n')}
          `;

    const vialsMessage =
      relatedPkgs.length > 0
        ? `Que por consequência causará a exclusão dos seguintes itens:
          ${relatedPkgs.map((vial) => `* ${vial.id}`).join('\n')}`
        : '';

    return reagentsMessage + vialsMessage;
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
