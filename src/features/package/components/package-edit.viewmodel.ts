import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { PackageEditProps } from '@/features/package/components/package-edit.view';
import { Package } from '@/features/package/package.type';
import { ReagentService } from '@/features/reagent/reagent.service';
import { Reagent } from '@/features/reagent/reagent.type';
import { Size } from '@/features/size/size.type';
import { formattedSize, normalizedAmount } from '@/features/size/size.util';
import Unit from '@/features/size/unit.type';
import { VialService } from '@/features/vial/vial.service';
import { useData } from '@/providers/data.provider';
import { toNullableLocalDate, validateDate } from '@/shared/utils/date';

type UsePackageEditProps = PackageEditProps & {
  reagentService: ReagentService;
  vialService: VialService;
};

const nullSize = { amount: 0, unit: Unit.Units };

type LabGroup = { laboratoryId: string; amount: number };

export function usePackageEdit(props: UsePackageEditProps) {
  const {
    reagents,
    suppliers,
    brands,
    laboratories,
    getReagentById,
    getBrandById,
    getSupplierById,
    getLaboratoryById,
  } = useData();

  const [reagentAddMode, setReagentAddMode] = useState(false);
  const [createdReagentName, setCreatedReagentName] = useState('');
  const [loadingAddReagent, setLoadingAddReagent] = useState(false);

  const [sizeAddMode, setSizeAddMode] = useState(false);
  const [addedSize, setAddedSize] = useState<Size | null>(null);
  const [loadingAddSize, setLoadingAddedSize] = useState(false);

  const [labGroups, setLabGroups] = useState<LabGroup[]>([]);
  const [labIdToAdd, setLabIdToAdd] = useState<string | null>(null);

  const [vialError, setVialsError] = useState<string | null>(null);

  const packageForm = useForm<Package>({
    initialValues: props.selectedPackage ?? {
      inDate: new Date(),
      expireDate: new Date(),
      size: nullSize,
      purity: 0,
      id: '',
      reagentId: '',
      brandId: '',
      supplierId: '',
      ...props.preFilledPackageData,
    },

    transformValues: (values: Package) => ({
      ...values,
      expireDate: toNullableLocalDate(values.expireDate)!,
      inDate: toNullableLocalDate(values.inDate)!,
      brandId: values.brandId !== '' ? values.brandId : null,
    }),

    validate: (values) => {
      const errors: Record<string, React.ReactNode> = {};

      if (!reagentAddMode && !values.reagentId) errors.reagentId = 'Inserir um reagente';

      if (values.purity === undefined || values.purity < 1 || values.purity > 100)
        errors.purity = 'Insira uma pureza entre 1 e 100 %';

      const isSizeInvalid = !values.size || (values.size as any) === '' || values.size.amount === 0;

      if (values.reagentId && isSizeInvalid) errors.size = 'Selecione um tamanho válido';

      const expireError = validateDate(values.expireDate, false);
      if (expireError) errors.expireDate = expireError;

      const inError = validateDate(values.inDate, false);
      if (inError) errors.inDate = inError;

      // Esse tem que ser o último
      const vialsSum = labGroups.reduce((sum, group) => sum + group.amount, 0);

      // Só avaliar se estiver no modo adição (sem reagente selecionado)
      if (!selectedReagent && vialsSum === 0) {
        const labGroupsError = 'É necessário adicionar pelo menos um frasco.';
        errors.labGroups = labGroupsError;
        setVialsError(labGroupsError);
      }

      return errors;
    },
  });

  const selectedReagent: Reagent | null =
    packageForm.values.reagentId !== '' ? getReagentById(packageForm.values.reagentId) : null;

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

  const handleAddSize = (size: Size) => {
    const newReagent = { ...selectedReagent!, sizes: [...selectedReagent!.sizes, size] };
    props.reagentService.update(selectedReagent!.id, newReagent);
    setAddedSize(size);
    setLoadingAddedSize(true);
  };

  const handleSubmitPackage = async (pkg: Package) => {
    if (props.selectedPackage) {
      props.onEditPackage(pkg);
    } else {
      const pkgCreated = await props.onAddPackage(pkg);

      Promise.all(
        labGroups.flatMap((group) =>
          Array.from({ length: group.amount }).map(() =>
            props.vialService.create({
              laboratoryId: group.laboratoryId,
              packageId: pkgCreated.id,
              outDate: null,
            })
          )
        )
      );
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

  const labGroupsWithNames = labGroups.map((group) => ({
    ...group,
    laboratoryName: getLaboratoryById(group.laboratoryId).name,
  }));

  // TODO: Ordenar esses 4
  const reagentSelectData = reagents!
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((opt) => ({
      value: opt.id,
      label: opt.name,
    }));

  // Ordenar menor -> maior
  const sizeSelectData = selectedReagent
    ? selectedReagent.sizes
        .sort((a, b) => normalizedAmount(a) - normalizedAmount(b))
        .map((s) => formattedSize(s))
    : undefined;

  const brandSelectData = brands!
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

  const availableLaboratories =
    laboratories!
      .filter((lab) => !labGroups.map((g) => g.laboratoryId).includes(lab.id))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((lab) => ({
        value: lab.id,
        label: lab.name,
      })) ?? [];

  const totalVials = labGroups.reduce((acc, g) => acc + g.amount, 0);

  const handleLabGroupAmountChange = (laboratoryId: string, value: number) => {
    if (value === 0) {
      setLabGroups(labGroups.filter((g) => g.laboratoryId !== laboratoryId));
    } else {
      setLabGroups(
        labGroups.map((g) => (g.laboratoryId === laboratoryId ? { ...g, amount: value } : g))
      );
    }
  };

  const handleAddLabGroup = () => {
    if (labIdToAdd) {
      setLabGroups([...labGroups, { laboratoryId: labIdToAdd, amount: 1 }]);
      setLabIdToAdd(null);
    }
  };

  const handleBrandChange = (value: string | null) => {
    const brand = value ? getBrandById(value) : null;
    packageForm.setValues({ brandId: brand?.id ?? '' });
  };

  const handleSupplierChange = (value: string | null) => {
    const supplier = value ? getSupplierById(value) : null;
    packageForm.setValues({ supplierId: supplier?.id ?? '' });
  };

  return {
    reagentAddMode,
    createdReagentName,
    loadingAddReagent,
    sizeAddMode,
    addedSize,
    loadingAddSize,
    labGroups,
    labGroupsWithNames,
    labIdToAdd,
    packageForm,
    selectedReagent,
    reagents,
    suppliers,
    brands,
    laboratories,
    setReagentAddMode,
    setCreatedReagentName,
    setLoadingAddReagent,
    setSizeAddMode,
    setLoadingAddedSize,
    setLabIdToAdd,
    setLabGroups,
    handleAddSize,
    handleSubmitPackage,
    handleChangeSize,
    handleChangeReagent,
    getBrandById,
    getSupplierById,
    reagentSelectData,
    sizeSelectData,
    brandSelectData,
    supplierSelectData,
    availableLaboratories,
    totalVials,
    vialError,
    handleLabGroupAmountChange,
    handleAddLabGroup,
    handleBrandChange,
    handleSupplierChange,
  };
}
