'use client';

import { useState } from 'react';
import { collection } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Box, Button, Grid } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ReagentsTable from '@/src/components/Table/ReagentsTable';
import {
  handleAddReagent,
  handleDeleteReagent,
  handleEditReagent,
  reagentConverter,
} from '@/src/services/reagentsDB';
import Reagent from '@/src/typings/Reagent';
import { db } from '@/src/utils/firebase';
import FilterOptions from '../components/FilterOptions';
import ReagentModal from '../components/ReagentModal';
import ReagentsFilter from '../typings/ReagentsFilter';

const initialFilter: ReagentsFilter = {
  expired: null,
  dateField: null,
  minDate: null,
  maxDate: null,
  dimension: null,
  minAmount: null,
  maxAmount: null,
};

export default function TableView() {
  const [reagentModalOpened, { open: openReagentModal, close: closeReagentModal }] =
    useDisclosure(false);
  const [selectedReagent, setSelectedReagent] = useState<Reagent | null>(null);
  const [onShowMode, { open: activateShowMode, close: deactivateShowMode }] = useDisclosure(false);
  const [reagents, loadingReagents, errorLoadingReagents] = useCollectionData<Reagent>(
    collection(db, 'reagents').withConverter(reagentConverter)
  );
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ReagentsFilter>(initialFilter);

  const handleChangeSearch = (search: string) => {
    setSearch(search);
  };

  const handleChangeFilter = (filter: ReagentsFilter) => {
    setFilter(filter);
  };

  const beginReagentEdit = (reagent: Reagent) => {
    setSelectedReagent(reagent);
    deactivateShowMode();
    openReagentModal();
  };

  const beginReagentAddition = () => {
    setSelectedReagent(null);
    deactivateShowMode();
    openReagentModal();
  };

  const handleShowReagent = (reagent: Reagent) => {
    setSelectedReagent(reagent);
    activateShowMode();
    openReagentModal();
  };

  return (
    <>
      {/* Modal de criação, edição e visualização */}
      <ReagentModal
        onShowMode={onShowMode}
        selectedReagent={selectedReagent}
        reagentModalOpened={reagentModalOpened}
        closeReagentModal={closeReagentModal}
        handleAddReagent={handleAddReagent}
        handleEditReagent={handleEditReagent}
        beginShownReagentEdit={selectedReagent ? () => beginReagentEdit(selectedReagent) : () => {}}
      />

      <h1>Reagentes</h1>

      <Grid>
        {/* Coluna dos filtros */}
        <Grid.Col span={{ base: 3 }}>
          <FilterOptions
            search={search}
            handleChangeSearch={handleChangeSearch}
            filter={filter}
            handleChangeFilter={handleChangeFilter}
          />
        </Grid.Col>

        {/* Coluna dos reagentes */}
        <Grid.Col span={{ base: 9 }}>
          <Box w={'100%'}>
            {/* Table */}
            {errorLoadingReagents ? (
              <p>ERRO AO CARREGAR DADOS!</p>
            ) : loadingReagents ? (
              <p>CARREGANDO DADOS...</p>
            ) : !reagents ? (
              <p>NENHUM DADO ENCONTRADO</p>
            ) : (
              <ReagentsTable
                reagents={reagents}
                search={search}
                filter={filter}
                handleDeleteReagent={handleDeleteReagent}
                beginReagentEdit={beginReagentEdit}
                handleShowReagent={handleShowReagent}
              />
            )}
          </Box>
        </Grid.Col>
      </Grid>

      {/* Add button */}
      <Button
        style={{ position: 'fixed', bottom: '20px', right: '20px' }}
        onClick={beginReagentAddition}
      >
        +
      </Button>
    </>
  );
}
