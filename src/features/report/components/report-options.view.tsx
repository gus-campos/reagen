import { useState } from 'react';
import { Modal } from '@mantine/core';
import { FilterOptions } from '@/features/stock-filter/components/filter-options.view';
import { CLEAN_STOCK_FILTER } from '@/features/stock-filter/stock-filter.constants';
import { StockFilter } from '@/features/stock-filter/stock-filter.type';

export function useConfigReportModal(initialFilter?: StockFilter) {
  const [modalOpened, setModalOpened] = useState(false);
  const [reportFilter, setReportFilter] = useState<StockFilter>(
    initialFilter ?? CLEAN_STOCK_FILTER
  );

  const closeModal = () => setModalOpened(false);
  const openModal = () => setModalOpened(true);
  const onSubmit = (reportFilter: StockFilter) => setReportFilter(reportFilter);

  return { reportFilter, modalOpened, closeModal, openModal, onSubmit };
}

type ConfigReportProps = {
  onSubmit: (filter: StockFilter) => void;
  onClose: () => void;
  opened: boolean;
  initialValues: StockFilter;
};

export function ConfigReportModal(props: ConfigReportProps) {
  const handleFilterChange = (filter: StockFilter) => props.onSubmit(filter);

  return (
    <Modal opened={props.opened} onClose={props.onClose} withCloseButton={false}>
      <FilterOptions filter={props.initialValues} onFilterChange={handleFilterChange} />
    </Modal>
  );
}
