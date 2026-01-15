import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { Package } from '@/features/package/package.type';
import { Reagent } from '@/features/reagent/reagent.type';
import { Size } from '@/features/size/size.type';
import { formattedSize } from '@/features/size/size.util';
import { Dimension } from '@/features/size/unit.type';
import { useData } from '@/providers/data.provider';
import { findPackagesOfReagentSizes, findRemovedSizes } from '@/shared/utils/misc';

type VialModalProps = {
  selectedReagent: Reagent | null;
  vialModalOpened: boolean;
  onClose: () => void;
  onAddReagent: (vial: Reagent) => void;
  onEditReagent: (selectedVial: Reagent) => void;
};

export function useReagentEdit(props: VialModalProps) {
  const [sizeAddMode, setSizeAddMode] = useState(false);
  const [unsavedSizes, setUnsavedSizes] = useState<Size[]>(props.selectedReagent?.sizes ?? []);
  const [warning, setWarning] = useState<string | null>(null);

  const { packages, controlAgencies } = useData();

  const reagentForm = useForm<Reagent>({
    initialValues: props.selectedReagent ?? {
      id: '',
      name: '',
      dimension: Dimension.Mass,
      sizes: [],
      controlAgencyId: null,
    },
    validate: {
      name: (value) => (!value.trim() ? 'Inserir nome' : null),
    },
  });

  const reagentWithSizes = { ...reagentForm.values, sizes: unsavedSizes };
  const isEditing = !!props.selectedReagent;
  const isDisabled = sizeAddMode;
  const submitButtonText = isEditing ? 'Salvar' : 'Adicionar';
  const shouldShowDimensionSelect = !isEditing;
  const shouldShowConfirmModal = warning !== null;
  const controlAgenciesData = controlAgencies!.map((c) => {
    return { value: c.id, label: c.name };
  });

  const getConfirmationMessage = (removedSizes: Size[], relatedPkgs: Package[]) => {
    return `Excluir os tamanhos: ${removedSizes.map((size) => formattedSize(size)).join(', ')}
    Causará a exclusão dos seguintes itens:
    ${relatedPkgs.map((vial) => `* ${vial.id}`).join('\n')}
    `;
  };

  const handleAddSize = (size: Size) => {
    setUnsavedSizes([...unsavedSizes, size]);
    setSizeAddMode(false);
  };

  const handleRemoveSize = (size: Size) => {
    setUnsavedSizes(unsavedSizes.filter((s) => formattedSize(s) !== formattedSize(size)));
  };

  const handleClose = () => {
    setSizeAddMode(false);
    props.onClose();
  };

  const handleConfirmEdit = () => {
    props.onEditReagent(reagentWithSizes);
    setWarning(null);
    handleClose();
  };

  const handleToggleSizeMode = () => {
    setSizeAddMode(true);
  };

  const handleCloseSizeMode = () => {
    setSizeAddMode(false);
  };

  const handleSubmit = reagentForm.onSubmit((values) => {
    if (isEditing) {
      const removedSizes = findRemovedSizes(values.sizes, reagentWithSizes.sizes);
      const relatedPkgs = findPackagesOfReagentSizes(
        props.selectedReagent!,
        removedSizes,
        packages!
      );

      if (relatedPkgs.length > 0) {
        const message = getConfirmationMessage(removedSizes, relatedPkgs);
        setWarning(message);
      } else {
        handleConfirmEdit();
      }
    } else {
      props.onAddReagent(reagentWithSizes);
      handleClose();
    }
  });

  useEffect(() => {
    setUnsavedSizes([]);
  }, [reagentForm.values.dimension]);

  useEffect(() => {
    if (props.selectedReagent) setUnsavedSizes(props.selectedReagent?.sizes);
  }, [props.selectedReagent]);

  return {
    reagentForm,
    sizeAddMode,
    unsavedSizes,
    warning,
    isEditing,
    isDisabled,
    submitButtonText,
    shouldShowDimensionSelect,
    shouldShowConfirmModal,
    controlAgenciesData,
    reagentWithSizes,
    handleAddSize,
    handleRemoveSize,
    handleClose,
    handleToggleSizeMode,
    handleCloseSizeMode,
    handleSubmit,
    handleConfirmEdit,
    setWarning,
  };
}
