'use client';

import { useData } from '@/src/providers/DataProvider';
import { NameDataView } from '@/src/shared/components/NameDataView';
import { findPackagesOfControlAgency, findReagentsOfControlAgency } from '@/src/shared/utils/misc';
import { Package } from '../package/types/package';
import { Reagent } from '../reagent/types/reagent';
import { ControlAgency } from './control-agency';
import { ControlAgencyService } from './ControlAgencyService';

export function ControlAgenciesView() {
  const { controlAgencies, loadingControlAgencies, reagents, packages } = useData();

  const getWarning = (controlAgency: ControlAgency) => {
    const relatedReagents = findReagentsOfControlAgency(controlAgency, reagents!);
    if (relatedReagents.length === 0) return null;
    const relatedPackages = findPackagesOfControlAgency(controlAgency, reagents!, packages!);

    return generateWarning(controlAgency, relatedReagents, relatedPackages);
  };

  const generateWarning = (
    controlAgency: ControlAgency,
    relatedReagents: Reagent[],
    relatedPackages: Package[]
  ) => {
    const reagentsMessage = `Excluir o orgão de controle: ${controlAgency.name}
          Causará a exclusão dos seguintes reagentes, pacotes e frascos:
          ${relatedReagents.map((reag) => `* ${reag.name}`).join('\n')}
          `;

    const packagesMessage =
      relatedPackages.length > 0
        ? `Que por consequência causará a exclusão dos seguintes pacotes e todos seus frascos:
          ${relatedPackages.map((pkg) => `* ${pkg.id}`).join('\n')}`
        : '';

    return reagentsMessage + packagesMessage;
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
