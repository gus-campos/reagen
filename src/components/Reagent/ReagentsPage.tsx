'use client';

import React, { useState } from 'react';
import { Box, Button, Grid, Paper, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Definition } from '@/src/models/definition';
import { Operation } from '../../models/operation';
import { Reagent } from '../../models/reagent';
import { ReagentsFilter } from '../../models/reagents-filter';
import { useData } from '../../providers/DataProvider';
import {
  uploadAddOperation,
  uploadDeleteOperation,
  uploadEditOperation,
} from '../../services/operationsDB';
import {
  uploadAddReagent,
  uploadDeleteReagent,
  uploadEditReagent,
} from '../../services/reagentsDB';
import { filteredReagent } from '../../utils/filtered-reagent';
import { formattedAmount } from '../../utils/formatted-amount';
import { formattedDate } from '../../utils/formatted-date';
import { normalizedAmount } from '../../utils/normalized-amount';
import { truncate } from '../../utils/truncate';
import { FilterOptions } from '../Crud/Filter/FilterOptions';
import { CrudOperations, TableCollumn, TableView } from '../Crud/Table/TableView';
import { OperationModal } from '../Operations/OperationModal';
import { ReagentModal } from './ReagentModal';

const initialFilter: ReagentsFilter = {
  expired: null,
  minDate: null,
  maxDate: null,
  dimension: null,
  minAmount: null,
  maxAmount: null,
};

function ExpandedComponent({ reagent }: { reagent: Reagent }) {
  const [operationModalOpened, { open: openOperationModal, close: closeOperationModal }] =
    useDisclosure(false);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  const [showMode, { open: activateShowMode, close: deactivateShowMode }] = useDisclosure(false);
  const { getOperationById } = useData();

  const handleBeginOperationAddition = () => {
    setSelectedOperation(null);
    deactivateShowMode();
    openOperationModal();
  };
  const handleAddOperation = (operation: Operation) => {
    uploadAddOperation(operation);
    closeOperationModal();
  };
  const handleEditOperation = (operation: Operation) => {
    uploadEditOperation(operation);
    closeOperationModal();
  };

  const handleBeginOperationEdit = (operation: Operation) => {
    setSelectedOperation(operation);
    deactivateShowMode();
    openOperationModal();
  };

  const handleShowOperation = (operation: Operation) => {
    setSelectedOperation(operation);
    activateShowMode();
    openOperationModal();
  };

  const handleDeleteOperation = (operation: Operation) => {
    uploadDeleteOperation(operation);
  };

  const crudOperations: CrudOperations<Operation> = {
    handleShowData: handleShowOperation,
    handleBeginDataEdit: handleBeginOperationEdit,
    handleDeleteData: handleDeleteOperation,
  };

  const initialCollums: TableCollumn<Operation>[] = [
    {
      name: 'Tipo',
      accessor: (operation: Operation) => String(operation.type),
    },
    {
      name: 'Data',
      accessor: (operation: Operation) => formattedDate(operation.date),
    },
    {
      name: 'Observações',
      accessor: (operation: Operation) => truncate(operation.notes ?? '', 15),
    },
  ];

  const operations = reagent.operationsIds
    .map((id) => getOperationById(id))
    .filter((operation) => !!operation);

  return (
    <Paper py="md" px="50px" pb="50px" radius="md" withBorder style={{ overflow: 'hidden' }}>
      <Text size="xl" ta="center" fw="bold" pb="md">
        Operações
      </Text>

      <TableView
        datas={operations}
        initialCollumns={initialCollums}
        crudOperations={crudOperations}
      />

      <Stack>
        <Button
          // style={{ position: 'fixed', bottom: '30px', right: '30px' }}
          onClick={handleBeginOperationAddition}
          variant="outline"
          bg="dark-grey"
        >
          +
        </Button>
      </Stack>

      <OperationModal
        reagent={reagent}
        onBeginShownOperationEdit={
          selectedOperation ? () => handleBeginOperationEdit(selectedOperation) : () => {}
        }
        onCloseOperationModal={closeOperationModal}
        onEditOperation={handleEditOperation}
        onAddOperation={handleAddOperation}
        operationModalOpened={operationModalOpened}
        selectedOperation={selectedOperation}
        showMode={showMode}
      />
    </Paper>
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
  const [definition, setDefinition] = useState<Definition | null>(null);

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

  const handleChangeDefinition = (definition: Definition | null) => {
    setDefinition(definition);
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
      name: 'Pureza',
      accessor: (reagent: Reagent) => (reagent.purity ? `${reagent.purity} %` : ''),
      hidden: false,
      fixed: false,
      ascending: null,
      sorter: (a: Reagent, b: Reagent) => a.purity - b.purity,
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
        <Grid.Col span={{ base: 3 }}>
          <FilterOptions
            search={search}
            filter={filter}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
            onDefinitionChange={handleChangeDefinition}
            definition={definition}
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
              expandedComponent={(reagent: Reagent) => <ExpandedComponent reagent={reagent} />}
            />
          </Box>
        </Grid.Col>
      </Grid>

      <Button
        style={{ position: 'fixed', bottom: '30px', right: '30px' }}
        onClick={handleBeginReagentAddition}
      >
        +
      </Button>

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
