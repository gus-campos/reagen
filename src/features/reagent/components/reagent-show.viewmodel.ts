import { Reagent } from '@/features/reagent/reagent.type';
import { useData } from '@/providers/data.provider';

type VialShowProps = {
  reagent: Reagent;
};

export function useReagentShow(props: VialShowProps) {
  const { getControlAgencyById } = useData();

  const controlAgency = props.reagent.controlAgencyId
    ? getControlAgencyById(props.reagent.controlAgencyId)
    : null;

  const controlAgencyDisplay = controlAgency?.name ?? '--';

  return {
    controlAgencyDisplay,
  };
}
