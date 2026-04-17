import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { StockFilter, stockFilterSchema } from '@/features/stock-filter/stock-filter.type';
import { useData } from '@/providers/data.provider';

type FilterOptionsProps = {
  filter: StockFilter;
  onFilterChange: (filter: StockFilter) => void;
};

export function useFilterOptions(props: FilterOptionsProps) {
  const { controlAgencies, fundingSources: fundingSources, suppliers, laboratories } = useData();

  const { register, getValues, setValue, control } = useForm({
    resolver: zodResolver(stockFilterSchema),
    defaultValues: {
      controlAgencyId: null,
      fundingSourceId: null,
      laboratoryId: null,
      supplierId: null,
      controlled: 'all',
      expired: 'all',
      fundingScope: 'all',
      outStatus: 'all',
      maxExpire: null,
      maxInDate: null,
      maxOutDate: null,
      minExpire: null,
      minInDate: null,
      minOutDate: null,
    },
  });

  // Ao mudar seleção, setar radio

  const formValues = getValues();

  const isInDateFilterActive = !!formValues.minInDate || !!formValues.maxInDate;
  const isOutDateFilterActive =
    formValues.outStatus !== 'all' || !!formValues.minOutDate || !!formValues.maxOutDate;
  const isExpireDateFilterActive =
    formValues.expired !== 'all' || !!formValues.minExpire || !!formValues.maxExpire;
  const isControlledFilterActive = formValues.controlled !== 'all' || !!formValues.controlAgencyId;
  const isFundingSourceFilterActive =
    formValues.fundingScope !== 'all' || formValues.fundingSourceId !== null;
  const isLaboratoryFilterActive = formValues.laboratoryId !== null;
  const isSupplierFilterActive = formValues.supplierId !== null;

  const controlAgencyOptions = controlAgencies!
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => ({
      value: c.id,
      label: c.name,
    }));

  const fundingSourceOptions = fundingSources!
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

  // Função pura que deriva valores dependentes
  //     function computeDerivedFilter(values: StockFilter): StockFilter {
  //     const fundingScope: 'all' | 'internal' | 'external' =
  //       values.fundingSourceId === null ? 'internal' : 'external';

  //     return {
  //       ...values,
  //       expired: values.minExpire || values.maxExpire ? 'expired' : values.expired,
  //       outStatus: values.minOutDate || values.maxOutDate ? 'is-out' : values.outStatus,
  //       controlled: values.controlAgencyId ? 'controlled' : values.controlled,
  //       fundingScope,
  //       fundingSourceId: fundingScope === 'internal' ? null : values.fundingSourceId,
  //     };
  //   }

  // 🔔 Debounced callback para enviar filtro derivado
  //   const watchedValues = watch();
  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       const derived = computeDerivedFilter(formValues);
  //       props.onFilterChange(derived);
  //     }, 500);

  //     return () => clearTimeout(timer);
  //   }, [watchedValues]);

  // Trocar use effect para watch do react hook?
  useEffect(() => {
    if (formValues.maxExpire || formValues.minExpire) {
      if (formValues.expired !== 'expired') {
        setValue('expired', 'expired');
      }
    }
  }, [formValues.maxExpire, formValues.minExpire]);

  useEffect(() => {
    if (formValues.minOutDate || formValues.maxOutDate) {
      if (formValues.outStatus !== 'is-out') {
        setValue('outStatus', 'is-out');
      }
    }
  }, [formValues.minOutDate, formValues.maxOutDate]);

  useEffect(() => {
    if (formValues.controlAgencyId) {
      if (formValues.controlled !== 'controlled') {
        setValue('controlled', 'controlled');
      }
    }
  }, [formValues.controlAgencyId]);

  useEffect(() => {
    if (formValues.fundingSourceId === null) return;

    // Se mudou pra null (interno, sem adquirinte), mudar escopo pra interno
    if (formValues.fundingSourceId === null && formValues.fundingScope !== 'internal') {
      setValue('fundingScope', 'internal');
    }

    // Se mudou pra diferente da emprapa, setar escopo externo
    else if (formValues.fundingSourceId !== null && formValues.fundingScope !== 'external') {
      setValue('fundingScope', 'external');
    }
  }, [formValues.fundingSourceId]);

  // Ao mudar radio, setar seleção

  useEffect(() => {
    if (formValues.expired !== 'expired') {
      if (formValues.minExpire !== null) setValue('minExpire', null);
      if (formValues.maxExpire !== null) setValue('maxExpire', null);
    }
  }, [formValues.expired]);

  useEffect(() => {
    if (formValues.outStatus !== 'is-out') {
      if (formValues.minOutDate !== null) setValue('minOutDate', null);
      if (formValues.maxOutDate !== null) setValue('maxOutDate', null);
    }
  }, [formValues.outStatus]);

  useEffect(() => {
    if (formValues.controlled !== 'controlled') {
      if (formValues.controlAgencyId !== null) {
        setValue('controlAgencyId', null);
      }
    }
  }, [formValues.controlled]);

  useEffect(() => {
    // Se mudou pra interno, mudar seleção pra nulo
    if (formValues.fundingScope === 'internal' && formValues.fundingSourceId !== null) {
      setValue('fundingSourceId', null);
    }

    // Se mudou pra externo, e tá nulo, limpar
    else if (formValues.fundingScope === 'external' && formValues.fundingSourceId === null) {
      setValue('fundingSourceId', null);
    }

    // Se mudou pra all, limpar
    else if (formValues.fundingScope === 'all' && formValues.fundingSourceId !== null) {
      setValue('fundingSourceId', null);
    }
  }, [formValues.fundingScope]);

  useEffect(() => {
    const timer = setTimeout(() => {
      props.onFilterChange(formValues);
    }, 500);

    return () => clearTimeout(timer);
  }, [formValues]);

  const handleControlAgencyChange = (value: string | null) => {
    setValue('controlAgencyId', value ? value : null);
  };
  const handleFundingSourceChange = (value: string | null) => {
    setValue('fundingSourceId', value ? value : null);
  };
  const handleLaboratoryChange = (value: string | null) => {
    setValue('laboratoryId', value ? value : null);
  };
  const handleSupplierChange = (value: string | null) => {
    setValue('supplierId', value ? value : null);
  };

  return {
    formValues,
    formControl: control,
    formRegister: register,
    isInDateFilterActive,
    isOutDateFilterActive,
    isExpireDateFilterActive,
    isControlledFilterActive,
    isFundingSourceFilterActive,
    isLaboratoryFilterActive,
    isSupplierFilterActive,
    controlAgencyOptions,
    fundingSourceOptions,
    laboratoryOptions,
    supplierOptions,
    handleControlAgencyChange,
    handleFundingSourceChange,
    handleLaboratoryChange,
    handleSupplierChange,
  };
}
