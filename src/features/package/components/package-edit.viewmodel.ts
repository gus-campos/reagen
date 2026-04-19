import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { LabGroup } from '@/features/package/components/package-edit-vials-add.viewmodel';
import { PackageEditProps } from '@/features/package/components/package-edit.view';
import { Package } from '@/features/package/package.type';
import { ReagentService } from '@/features/reagent/reagent.service';
import { Reagent } from '@/features/reagent/reagent.type';
import { Size } from '@/features/size/size.type';
import { formattedSize, normalizedAmount } from '@/features/size/size.util';
import { VialService } from '@/features/vial/vial.service';
import { Vial } from '@/features/vial/vial.type';
import { useData } from '@/providers/data.provider';
import { toNullableLocalDate, validateDate } from '@/shared/utils/date';
import { findVialsOfPackage } from '@/shared/utils/misc';

type UsePackageEditProps = PackageEditProps & {
  reagentService: ReagentService;
  vialService: VialService;
};

export function usePackageEdit(props: UsePackageEditProps) {
  const {
    reagents,
    suppliers,
    fundingSources,
    laboratories,
    vials,
    getReagentById,
    getFundingSourceById,
    getSupplierById,
  } = useData();

  // STATES

  const [reagentAddMode, setReagentAddMode] = useState(false);
  const [createdReagentName, setCreatedReagentName] = useState('');
  const [loadingAddReagent, setLoadingAddReagent] = useState(false);

  const [vialsEdited, setVialsEdited] = useState<Vial[]>(
    props.selectedPackage ? findVialsOfPackage(props.selectedPackage, vials!) : []
  );

  const [labGroupsError, setLabGroupsError] = useState<string | null>(null);

  const [sizeAddMode, setSizeAddMode] = useState(false);
  const [addedSize, setAddedSize] = useState<Size | null>(null);
  const [loadingAddSize, setLoadingAddedSize] = useState(false);

  // FORM

  const packageForm = useForm<Package>({
    initialValues: props.selectedPackage ?? {
      inDate: new Date(),
      expireDate: undefined as any,
      size: undefined as any,
      purity: 0,
      id: '',
      reagentId: '',
      fundingSourceId: null,
      supplierId: '',
      ...props.preFilledPackageData,
    },

    transformValues: (values: Package) => ({
      ...values,
      expireDate: toNullableLocalDate(values.expireDate)!,
      inDate: toNullableLocalDate(values.inDate)!,
    }),

    validate: (values) => {
      const errors: Record<string, React.ReactNode> = {};

      if (!reagentAddMode && !values.reagentId) errors.reagentId = 'Inserir um reagente';

      if (values.purity === undefined || values.purity < 1 || values.purity > 100)
        errors.purity = 'Insira uma pureza entre 1 e 100 %';

      const isSizeInvalid = !values.size;

      if (values.reagentId && isSizeInvalid) errors.size = 'Selecione um tamanho válido';

      const expireError = validateDate(values.expireDate, false);
      if (expireError) errors.expireDate = expireError;

      const inError = validateDate(values.inDate, false);
      if (inError) errors.inDate = inError;

      if (!values.expireDate) {
        errors.expireDate = 'Data de validade é obrigatória';
      } else {
        const expireError = validateDate(values.expireDate, false);
        if (expireError) errors.expireDate = expireError;
      }

      // Registrar erro do lab groups como erro do form
      if (vialsEdited.length <= 0) {
        const errorMessage = 'É necessário adicionar pelo menos um frasco.';
        setLabGroupsError(errorMessage);
        errors.labGroups = errorMessage;
      } else {
        setLabGroupsError(null);
      }

      return errors;
    },
  });

  const selectedReagent: Reagent | null =
    packageForm.values.reagentId !== '' ? getReagentById(packageForm.values.reagentId) : null;

  // EFFECTS

  useEffect(() => {
    if (reagentAddMode && loadingAddReagent) {
      setReagentAddMode(false);
      setLoadingAddReagent(false);
    }
  }, [reagents]);

  useEffect(() => {
    if (sizeAddMode && loadingAddSize) {
      setSizeAddMode(false);
      setLoadingAddedSize(false);
    }
  }, [reagents]);

  useEffect(() => {
    if (!reagentAddMode && !loadingAddReagent && createdReagentName !== '') {
      const reagent = reagents?.find((reag) => createdReagentName.trim() === reag.name.trim());
      if (!reagent) {
        return;
      }
      packageForm.setValues({ reagentId: reagent.id });
      setCreatedReagentName('');
    }

    // Se no modo adição, não sobrescrever valor
    if (!selectedReagent) packageForm.setFieldValue('size', '' as any);
  }, [loadingAddReagent]);

  useEffect(() => {
    if (!sizeAddMode && !loadingAddSize && addedSize !== null) {
      const selectedSize = selectedReagent?.sizes.find(
        (size: Size) => formattedSize(size) === formattedSize(addedSize)
      );
      if (!sizeAddMode && !loadingAddSize && addedSize) {
        packageForm.setValues({ size: selectedSize });
        setAddedSize(null);
      }
    }
  }, [loadingAddSize]);

  // HANDLES

  const handleAddSize = (size: Size) => {
    const newReagent = { ...selectedReagent!, sizes: [...selectedReagent!.sizes, size] };
    props.reagentService.update(selectedReagent!.id, newReagent);
    setAddedSize(size);
    setLoadingAddedSize(true);
  };

  const handleChangeLabGroups = (labGroups: LabGroup[]) => {

    const vialsFromGroup: Vial[] = labGroups.flatMap((group) =>
      Array.from({ length: group.amount }).map(() => ({
        id: 'ID_NULO',
        packageId: 'ID_NULO',
        laboratoryId: group.laboratoryId,
        outDate: null,
      }))
    );

    setVialsEdited(vialsFromGroup);
  };

  const handleSubmitPackage = async (pkg: Package) => {
    if (props.selectedPackage) {
      // Editar pacote
      props.onEditPackage(pkg);
      // Editar vials
      // ...
    } else {
      // Criar pacote e vials
      const packageCreated = await props.onAddPackage(pkg);

      // FIXME: Essa lógica devia estar do lado de fora
      const vialsWithPackageId = vialsEdited.map((vial) => ({
        ...vial,
        packageId: packageCreated.id,
      }));
      await Promise.all(vialsWithPackageId.map((vial) => props.vialService.create(vial)));
    }

    props.onClosePackageModal();
  };

  const handleChangeSize = (value: string | null) => {
    if (value === null || value === '') {
      packageForm.setFieldValue('size', '' as any);
      packageForm.setTouched({ ...packageForm.isTouched, size: false });
    } else {
      const sizeObj = selectedReagent?.sizes.find((s) => formattedSize(s) === value);
      packageForm.setFieldValue('size', sizeObj ?? ('' as any));
    }
  };

  const handleChangeReagent = (value: string | null) => {
    const validReagent = reagents?.find((r) => r.id === value);
    packageForm.setValues({
      reagentId: validReagent?.id ?? undefined,
    });

    packageForm.setFieldValue('size', validReagent?.sizes[0] ?? ('' as any));
  };

  const handleFundingSourceChange = (value: string | null) => {
    packageForm.setValues({ fundingSourceId: value });
  };

  const handleSupplierChange = (value: string | null) => {
    const supplier = value ? getSupplierById(value) : null;
    packageForm.setValues({ supplierId: supplier?.id ?? '' });
  };

  // CONSTANTS

  const reagentSelectData = reagents!
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((opt) => ({
      value: opt.id,
      label: opt.name,
    }));

  // Ordenar do menor pro maior
  const sizeSelectData = selectedReagent
    ? selectedReagent.sizes
        .sort((a, b) => normalizedAmount(a) - normalizedAmount(b))
        .map((s) => formattedSize(s))
    : undefined;

  const fundingSourceSelectData = fundingSources!
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((b) => ({
      value: b.id,
      label: b.name,
    }));

  const supplierSelectData = suppliers!
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((s) => ({
      value: s.id,
      label: s.name,
    }));

  const labGroups = Object.values(
    vialsEdited.reduce(
      (labIdGroups, vial) => {
        const labId = vial.laboratoryId;

        labIdGroups[labId] = {
          laboratoryId: labId,
          amount: (labIdGroups[labId]?.amount ?? 0) + 1,
        };

        return labIdGroups;
      },
      {} as Record<string, LabGroup>
    )
  );

  return {
    reagentAddMode,
    createdReagentName,
    loadingAddReagent,
    sizeAddMode,
    addedSize,
    loadingAddSize,
    packageForm,
    selectedReagent,
    reagents,
    suppliers,
    fundingSources,
    laboratories,
    setReagentAddMode,
    setCreatedReagentName,
    setLoadingAddReagent,
    setSizeAddMode,
    setLoadingAddedSize,
    handleAddSize,
    handleSubmitPackage,
    handleChangeSize,
    handleChangeReagent,
    getFundingSourceById,
    getSupplierById,
    reagentSelectData,
    sizeSelectData,
    fundingSourceSelectData,
    supplierSelectData,
    handleFundingSourceChange,
    handleSupplierChange,

    // Vials
    labGroups,
    labGroupsError,
    handleChangeLabGroups,
  };
}
