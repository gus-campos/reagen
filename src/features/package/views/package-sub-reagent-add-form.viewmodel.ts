import { useForm } from '@mantine/form';
import { Reagent } from '@/features/reagent/reagent.type';
import { Dimension } from '@/features/size/unit.type';
import { useData } from '@/providers/data.provider';

export function usePackageSubReagentAddForm() {
  const { reagents, controlAgencies } = useData();

  const reagentForm = useForm<Reagent>({
    initialValues: {
      name: '',
      id: '',
      dimension: Dimension.Mass,
      sizes: [],
      controlAgencyId: null,
    },
    validate: {
      name: (value) =>
        value === ''
          ? 'Dê um nome pro reagente'
          : reagents?.some((reag) => value.toLowerCase() === reag.name.toLocaleLowerCase())
            ? 'Este reagente já existe'
            : null,
    },
  });

  return {
    reagentForm,
    controlAgencies,
  };
}
