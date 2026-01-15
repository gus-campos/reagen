import { useForm } from '@mantine/form';
import { NameData } from '@/shared/types/name-data';

type NameDataEditProps<T extends NameData> = {
  selectedData: T;
  onAddData: (data: T) => void;
  onEditData: (data: T) => void;
  onCancel: () => void;
};

export function useNameDataEdit<T extends NameData>(props: NameDataEditProps<T>) {
  const dataForm = useForm<NameData>({
    initialValues: {
      name: props.selectedData?.name ?? '',
      id: props.selectedData?.id ?? '',
    },
    validate: {
      name: (value: string) => (value.trim() === '' ? 'Nome não deve ser vazio' : null),
    },
  });

  const isEditing = !!props.selectedData;
  const submitButtonText = isEditing ? 'Editar' : 'Adicionar';

  const handleSubmit = (values: NameData) => {
    const formData = values as unknown as T;
    if (isEditing) {
      props.onEditData(formData);
    } else {
      props.onAddData(formData);
    }
  };

  return {
    dataForm,
    isEditing,
    submitButtonText,
    handleSubmit,
  };
}
