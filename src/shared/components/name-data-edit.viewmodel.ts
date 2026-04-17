import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { NameData } from '@/shared/types/name-data';

type NameDataEditProps<T extends NameData> = {
  selectedData: T;
  onAddData: (data: T) => void;
  onEditData: (data: T) => void;
  onCancel: () => void;
};

const namedDataFormDataSchema = z.object({
  name: z.string().nonempty('Nome não deve ser vazio'),
});

type NamedDataFormData = z.infer<typeof namedDataFormDataSchema>;

export function useNameDataEdit<T extends NameData>(props: NameDataEditProps<T>) {
  const { register, handleSubmit, formState } = useForm<NamedDataFormData>({
    resolver: zodResolver(namedDataFormDataSchema),
    defaultValues: { name: props.selectedData?.name ?? '' },
  });

  const isEditing = !!props.selectedData;
  const submitButtonText = isEditing ? 'Editar' : 'Adicionar';

  const onSubmit = (values: NamedDataFormData) => {
    
    const formData: T = {
      ...props.selectedData,
      ...values,
    };

    if (isEditing) {
      props.onEditData(formData);
    } else {
      props.onAddData(formData);
    }
  };

  return {
    isEditing,
    submitButtonText,
    formErrors: formState.errors,
    handleSubmit: handleSubmit(onSubmit),
    register,
  };
}
