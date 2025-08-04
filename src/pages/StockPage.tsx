'use client';

import { useState } from 'react';
import { collection } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Box, Button, Grid } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { reagentConverter, uploadDeleteReagent } from '@/src/services/reagentsDB';
import { db } from '@/src/utils/firebase';
import { ReagentModal } from '../components/ReagentModal';
import { CrudOperations, TableCollumn } from '../components/Table/DataTable';
import { Reagent } from '../models/reagent';
import { ReagentsFilter } from '../models/reagents-filter';
import { uploadAddReagent, uploadEditReagent } from '../services/reagentsDB';
import { formattedAmount } from '../utils/formatted-amount';
import { formattedDate } from '../utils/formatted-date';
import { FilterOptions } from '../view/FilterOptions';
import { TableView } from '../view/TableView';

const initialFilter: ReagentsFilter = {
  expired: null,
  dateField: null,
  minDate: null,
  maxDate: null,
  dimension: null,
  minAmount: null,
  maxAmount: null,
};

export function StockPage() {
  const [reagents, loadingReagents, errorLoadingReagents] = useCollectionData<Reagent>(
    collection(db, 'reagents').withConverter(reagentConverter)
  );

  const [reagentModalOpened, { open: openReagentModal, close: closeReagentModal }] =
    useDisclosure(false);
  const [selectedReagent, setSelectedReagent] = useState<Reagent | null>(null);
  const [showMode, { open: activateShowMode, close: deactivateShowMode }] = useDisclosure(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ReagentsFilter>(initialFilter);

  const handleChangeSearch = (search: string) => {
    setSearch(search);
  };

  const handleChangeFilter = (filter: ReagentsFilter) => {
    setFilter(filter);
  };

  const handleBeginReagentAddition = () => {
    setSelectedReagent(null);
    deactivateShowMode();
    openReagentModal();
  };

  const handleShowReagent = (reagent: Reagent) => {
    setSelectedReagent(reagent);
    activateShowMode();
    openReagentModal();
  };

  const handleBeginReagentEdit = (reagent: Reagent) => {
    setSelectedReagent(reagent);
    deactivateShowMode();
    openReagentModal();
  };

  const handleAddReagent = (reagent: Reagent) => {
    uploadAddReagent(reagent);
    closeReagentModal();
  };

  const handleEditReagent = (reagent: Reagent) => {
    uploadEditReagent(reagent);
    closeReagentModal();
  };

  const handleDeleteReagent = (reagent: Reagent) => {
    uploadDeleteReagent(reagent);
  };

  const sortReagents = (a: Reagent, b: Reagent) => {
    return b.name.localeCompare(a.name);
  };

  const crudOperations: CrudOperations<Reagent> = {
    // handleChangeSearch,
    // handleChangeFilter,
    // handleBeginReagentAddition,
    // handleAddReagent,
    // handleEditReagent,
    sortData: sortReagents,
    handleShowData: handleShowReagent,
    handleBeginDataEdit: handleBeginReagentEdit,
    handleDeleteData: handleDeleteReagent,
  };

  const initialCollumns: TableCollumn<Reagent>[] = [
    {
      name: 'Nome',
      accessor: (reagent: Reagent) => reagent.name,
      hidden: false,
      fixed: true,
    },
    {
      name: 'Quantidade',
      accessor: (reagent: Reagent) => formattedAmount(reagent),
      hidden: false,
      fixed: false,
    },
    {
      name: 'Entrada',
      accessor: (reagent: Reagent) => formattedDate(reagent.inDate),
      hidden: false,
      fixed: false,
    },
    {
      name: 'Saída',
      accessor: (reagent: Reagent) => formattedDate(reagent.outDate),
      hidden: false,
      fixed: false,
    },
    {
      name: 'Vencimeto',
      accessor: (reagent: Reagent) => formattedDate(reagent.expireDate),
      hidden: false,
      fixed: false,
    },
  ];

  return (
    <>
      <h1>Reagentes</h1>
      <Grid>
        {/* Coluna dos filtros */}
        <Grid.Col span={{ base: 3 }}>
          <FilterOptions
            search={search}
            filter={filter}
            onSearchChange={handleChangeSearch}
            onFilterChange={handleChangeFilter}
          />
        </Grid.Col>

        {/* Modal de criação, edição e visualização */}
        <ReagentModal
          showMode={showMode}
          selectedReagent={selectedReagent}
          reagentModalOpened={reagentModalOpened}
          onCloseReagentModal={closeReagentModal}
          onAddReagent={handleAddReagent}
          onEditReagent={handleEditReagent}
          onBeginShownReagentEdit={
            selectedReagent ? () => handleBeginReagentEdit(selectedReagent) : () => {}
          }
        />
        <Grid.Col span={{ base: 9 }}>
          <Box w={'100%'}>
            <TableView
              datas={reagents}
              initialCollumns={initialCollumns}
              search={search}
              filter={filter}
              crudOperations={crudOperations}
              errorLoading={!!errorLoadingReagents}
              loading={loadingReagents}
            />
          </Box>
        </Grid.Col>
      </Grid>

      {/* Add button */}
      <Button
        style={{ position: 'fixed', bottom: '30px', right: '30px' }}
        onClick={handleBeginReagentAddition}
      >
        +
      </Button>
    </>
  );
}
