import { ComboboxItemGroup } from '@mantine/core';
import { useForm } from '@mantine/form';
import { SizeAddFormProps } from '@/features/reagent/components/size-add-form.view';
import { Size } from '@/features/size/size.type';
import Unit, { Dimension, DimensionDefaultUnit, UnitDimension } from '@/features/size/unit.type';

export function useSizeAddForm(props: SizeAddFormProps) {
  const dimension = props.selectedReagent.dimension;

  const unitSelectOptions: ComboboxItemGroup[] = dimension
    ? [
        {
          group: dimension,
          items: dimension
            ? Object.values(Unit).filter((unit) => UnitDimension[unit] === dimension)
            : [],
        },
      ]
    : [];

  const validateAmount = (value: number, currentUnit: string): string | null => {
    const countUnits =
      unitSelectOptions.find((group) => group.group === Dimension.Count)?.items ?? [];

    if (value <= 0) {
      return 'Só é possível adicionar quantidade maior que 0';
    }

    if (countUnits.includes(currentUnit) && value % 1 !== 0) {
      return 'Precisa ser inteiro';
    }

    return null;
  };

  const currentSizes = props.unsavedSizes ?? props.selectedReagent?.sizes ?? [];

  const sizeForm = useForm<Size>({
    initialValues: {
      amount: 0,
      unit: props.selectedReagent
        ? DimensionDefaultUnit[props.selectedReagent.dimension]
        : Unit.Gram,
    },
    validate: {
      amount: (value) => {
        const validationError = validateAmount(value, sizeForm.values.unit);
        if (validationError !== null) {
          return validationError;
        }

        const size: Size = { amount: value, unit: sizeForm.values.unit };
        const found = currentSizes.find((s) => s.amount === size.amount && s.unit === size.unit);
        if (found) {
          return 'Combinação já existente.';
        }

        return null;
      },
      unit: (value) => {
        const size: Size = { amount: sizeForm.values.amount, unit: value };
        const found = currentSizes.find((s) => s.amount === size.amount && s.unit === size.unit);
        if (found) {
          return 'Combinação já existente.';
        }

        return null;
      },
    },
  });

  const shouldShowLoader = props.loadingAddSize;
  const formTitle = `Novo tamanho de ${props.selectedReagent.name}`;

  const handleSubmit = (size: Size) => {
    props.onAddSize(size);
  };

  return {
    sizeForm,
    shouldShowLoader,
    formTitle,
    unitSelectOptions,
    handleSubmit,
  };
}
