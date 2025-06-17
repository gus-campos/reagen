'use client';

import { createContext, useState } from 'react';
import { Box, Button, Grid } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ReagentModal } from '../components/ReagentModal';
import { uploadAddReagent, uploadDeleteReagent, uploadEditReagent } from '../services/reagentsDB';
import { Reagent } from '../typings/reagent';
import { ReagentsFilter } from '../typings/reagents-filter';
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

export type CrudContextProps = {
  handleShowReagent: (reagent: Reagent) => void;
  handleBeginReagentEdit: (reagent: Reagent) => void;
  handleDeleteReagent: (reagent: Reagent) => void;
};

export const CrudContext = createContext<CrudContextProps>({
  handleShowReagent: () => {},
  handleBeginReagentEdit: () => {},
  handleDeleteReagent: () => {},
});

export function StockPage() {
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
            <CrudContext.Provider
              value={{
                handleShowReagent,
                handleBeginReagentEdit,
                handleDeleteReagent,
              }}
            >
              <TableView search={search} filter={filter} />
            </CrudContext.Provider>
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
