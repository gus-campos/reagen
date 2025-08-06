'use client';

import React, { useContext, useState } from 'react';
import { collection } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Box, Button, Grid, Text, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { reagentConverter, uploadDeleteReagent } from '@/src/services/reagentsDB';
import { db } from '@/src/utils/firebase';
import { ReagentModal } from '../components/Reagent/ReagentModal';
import { Reagent } from '../models/reagent';
import { ReagentsFilter } from '../models/reagents-filter';
import { useData } from '../providers/DataProvider';
import { uploadAddReagent, uploadEditReagent } from '../services/reagentsDB';
import { filteredReagent } from '../utils/filtered-reagent';
import { formattedAmount } from '../utils/formatted-amount';
import { formattedDate } from '../utils/formatted-date';
import { normalizedAmount } from '../utils/normalized-amount';
import { FilterOptions } from '../view/FilterOptions';
import { CrudOperations, TableCollumn, TableView } from '../view/TableView';

const initialFilter: ReagentsFilter = {
  expired: null,
  dateField: null,
  minDate: null,
  maxDate: null,
  dimension: null,
  minAmount: null,
  maxAmount: null,
};

function ExpandedComponent(reagent: Reagent) {
  return (
    <>
      <Text size="lg" fw="bold">
        Operações
      </Text>
      {reagent.operations.map((operation) => (
        <Text>{operation.type}</Text>
      ))}
    </>
  );
}

export function ReagentsPage() {
  const { reagents, getDefinitionById } = useData();
  const [reagentModalOpened, { open: openReagentModal, close: closeReagentModal }] =
    useDisclosure(false);
  const [selectedReagent, setSelectedReagent] = useState<Reagent | null>(null);
  const [showMode, { open: activateShowMode, close: deactivateShowMode }] = useDisclosure(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ReagentsFilter>(initialFilter);

  const handleSearchChange = (search: string) => {
    setSearch(search);
  };

  const handleFilterChange = (filter: ReagentsFilter) => {
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

  const crudOperations: CrudOperations<Reagent> = {
    handleShowData: handleShowReagent,
    handleBeginDataEdit: handleBeginReagentEdit,
    handleDeleteData: handleDeleteReagent,
  };

  const initialCollumns: TableCollumn<Reagent>[] = [
    {
      name: 'Definição',
      accessor: (reagent: Reagent) => getDefinitionById(reagent.definitionId)?.name ?? 'ND',
      hidden: false,
      fixed: true,
      ascending: false,
      sorter: (a: Reagent, b: Reagent) =>
        (getDefinitionById(a.definitionId)?.name ?? '')
          .trim()
          .localeCompare((getDefinitionById(b.definitionId)?.name ?? '').trim()),
      sortingPriority: 0,
    },
    {
      name: 'Quantidade',
      accessor: (reagent: Reagent) => formattedAmount(reagent),
      hidden: false,
      fixed: false,
      ascending: null,
      sorter: (a: Reagent, b: Reagent) => normalizedAmount(a) - normalizedAmount(b),
      sortingPriority: null,
    },
    {
      name: 'Entrada',
      accessor: (reagent: Reagent) => formattedDate(reagent.inDate),
      hidden: false,
      fixed: false,
      ascending: null,
      sorter: (a: Reagent, b: Reagent) =>
        (a.inDate?.getTime() ?? Infinity) - (b.inDate?.getTime() ?? Infinity),
      sortingPriority: null,
    },
    {
      name: 'Saída',
      accessor: (reagent: Reagent) => formattedDate(reagent.outDate),
      hidden: false,
      fixed: false,
      ascending: null,
      sorter: (a: Reagent, b: Reagent) =>
        (a.outDate?.getTime() ?? Infinity) - (b.outDate?.getTime() ?? Infinity),
      sortingPriority: null,
    },
    {
      name: 'Vencimeto',
      accessor: (reagent: Reagent) => formattedDate(reagent.expireDate),
      hidden: false,
      fixed: false,
      ascending: null,
      sorter: (a: Reagent, b: Reagent) =>
        (a.expireDate?.getTime() ?? Infinity) - (b.expireDate?.getTime() ?? Infinity),
      sortingPriority: null,
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
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 9 }}>
          <Box w={'100%'}>
            <TableView
              datas={reagents}
              initialCollumns={initialCollumns}
              search={search}
              searched={(reagent: Reagent) => getDefinitionById(reagent.definitionId)?.name ?? ''}
              dataFilter={(reagent: Reagent) => filteredReagent(reagent, filter)}
              crudOperations={crudOperations}
              expandedComponent={ExpandedComponent}
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
    </>
  );
}
