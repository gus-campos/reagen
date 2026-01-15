import { useEffect } from 'react';
import { useForm } from '@mantine/form';
import { StockFilter } from '@/features/stock-filter/stock-filter.type';
import { useData } from '@/providers/data.provider';
import { toNullableLocalDate } from '@/shared/utils/date';

type FilterOptionsProps = {
  filter: StockFilter;
  onFilterChange: (filter: StockFilter) => void;
};

export function useFilterOptions(props: FilterOptionsProps) {
  const { controlAgencies, brands, suppliers, laboratories } = useData();

  const form = useForm<StockFilter>({
    initialValues: props.filter,
    transformValues: (values) => ({
      ...values,
      minExpire: toNullableLocalDate(values.minExpire),
      maxExpire: toNullableLocalDate(values.maxExpire),
    }),
  });

  const dateFieldsDisabled = form.values.expired !== 'all';
  const expiredDisabled = form.values.maxExpire !== null || form.values.minExpire !== null;
  const controlledDisabled = form.values.controlAgencyId !== null;
  const controlAgencyDisabled = form.values.controlled !== 'all';

  const isExpireDateFilterActive =
    form.values.expired !== 'all' || !!form.values.minExpire || !!form.values.maxExpire;
  const isControlledFilterActive =
    form.values.controlled !== 'all' || !!form.values.controlAgencyId;
  const isBrandFilterActive = form.values.brandId !== null;
  const isLaboratoryFilterActive = form.values.laboratoryId !== null;
  const isSupplierFilterActive = form.values.supplierId !== null;

  const controlAgencyOptions = controlAgencies!.map((c) => ({
    value: c.id,
    label: c.name,
  }));
  const brandOptions = brands!.map((b) => ({
    value: b.id,
    label: b.name,
  }));
  const laboratoryOptions = laboratories!.map((l) => ({
    value: l.id,
    label: l.name,
  }));
  const supplierOptions = suppliers!.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const handleControlAgencyChange = (value: string | null) => {
    form.setValues({ controlAgencyId: value ? value : null });
  };
  const handleBrandChange = (value: string | null) => {
    form.setValues({ brandId: value ? value : null });
  };
  const handleLaboratoryChange = (value: string | null) => {
    form.setValues({ laboratoryId: value ? value : null });
  };
  const handleSupplierChange = (value: string | null) => {
    form.setValues({ supplierId: value ? value : null });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      props.onFilterChange(form.getTransformedValues());
    }, 500);

    return () => clearTimeout(timer);
  }, [form.values]);

  return {
    form,
    dateFieldsDisabled,
    expiredDisabled,
    controlledDisabled,
    controlAgencyDisabled,
    isExpireDateFilterActive,
    isControlledFilterActive,
    isBrandFilterActive,
    isLaboratoryFilterActive,
    isSupplierFilterActive,
    controlAgencyOptions,
    brandOptions,
    laboratoryOptions,
    supplierOptions,
    handleControlAgencyChange,
    handleBrandChange,
    handleLaboratoryChange,
    handleSupplierChange,
  };
}
