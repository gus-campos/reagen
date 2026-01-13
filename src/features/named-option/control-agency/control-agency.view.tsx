'use client';

import { ControlAgencyService } from '@/features/named-option/control-agency/control-agency.service';
import { ControlAgency } from '@/features/named-option/control-agency/control-agency.type';
import { NamedOptionView } from '@/features/named-option/named-option.view';
import { Package } from '@/features/package/package.type';
import { Reagent } from '@/features/reagent/reagent.type';
import { useData } from '@/providers/data.provider';
import { findPackagesOfControlAgency, findReagentsOfControlAgency } from '@/shared/utils/misc';

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
    <NamedOptionView
      dataName="Orgão de Controle"
      dataService={ControlAgencyService.instance}
      datas={controlAgencies}
      loadingData={loadingControlAgencies}
      getDeleteWarning={getWarning}
    />
  );
}
