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
  const { controlAgencies, fundingSources: brands, suppliers, laboratories } = useData();

  const form = useForm<StockFilter>({
    initialValues: props.filter,
    transformValues: (values) => ({
      ...values,
      minExpire: toNullableLocalDate(values.minExpire),
      maxExpire: toNullableLocalDate(values.maxExpire),
      minInDate: toNullableLocalDate(values.minInDate),
      maxInDate: toNullableLocalDate(values.maxInDate),
      minOutDate: toNullableLocalDate(values.minOutDate),
      maxOutDate: toNullableLocalDate(values.maxOutDate),
    }),
  });

  // Ao mudar seleção, setar radio

  useEffect(() => {
    if (form.values.maxExpire || form.values.minExpire) {
      if (form.values.expired !== 'expired') {
        form.setValues({ expired: 'expired' });
      }
    }
  }, [form.values.maxExpire, form.values.minExpire]);

  useEffect(() => {
    if (form.values.minOutDate || form.values.maxOutDate) {
      if (form.values.outStatus !== 'is-out') {
        form.setValues({ outStatus: 'is-out' });
      }
    }
  }, [form.values.minOutDate, form.values.maxOutDate]);

  useEffect(() => {
    if (form.values.controlAgencyId) {
      if (form.values.controlled !== 'controlled') {
        form.setValues({ controlled: 'controlled' });
      }
    }
  }, [form.values.controlAgencyId]);

  // Ao mudar radio, setar seleção

  useEffect(() => {
    if (form.values.expired !== 'expired') {
      if (form.values.minExpire !== null) form.setValues({ minExpire: null });
      if (form.values.maxExpire !== null) form.setValues({ maxExpire: null });
    }
  }, [form.values.expired]);

  useEffect(() => {
    if (form.values.outStatus !== 'is-out') {
      if (form.values.minOutDate !== null) form.setValues({ minOutDate: null });
      if (form.values.maxOutDate !== null) form.setValues({ maxOutDate: null });
    }
  }, [form.values.outStatus]);

  useEffect(() => {
    if (form.values.controlled !== 'controlled') {
      if (form.values.controlAgencyId !== null) {
        form.setValues({ controlAgencyId: null });
      }
    }
  }, [form.values.controlled]);

  const isInDateFilterActive = !!form.values.minInDate || !!form.values.maxInDate;
  const isOutDateFilterActive =
    form.values.outStatus !== 'all' || !!form.values.minOutDate || !!form.values.maxOutDate;
  const isExpireDateFilterActive =
    form.values.expired !== 'all' || !!form.values.minExpire || !!form.values.maxExpire;
  const isControlledFilterActive =
    form.values.controlled !== 'all' || !!form.values.controlAgencyId;
  const isBrandFilterActive = form.values.brandId !== null;
  const isLaboratoryFilterActive = form.values.laboratoryId !== null;
  const isSupplierFilterActive = form.values.supplierId !== null;

  const controlAgencyOptions = controlAgencies!
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => ({
      value: c.id,
      label: c.name,
    }));

  const brandOptions = brands!
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((b) => ({
      value: b.id,
      label: b.name,
    }));

  const laboratoryOptions = laboratories!
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((l) => ({
      value: l.id,
      label: l.name,
    }));

  const supplierOptions = suppliers!
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((s) => ({
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
    isInDateFilterActive,
    isOutDateFilterActive,
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
