'use client';

import React, { useMemo, useState } from 'react';
import { Box, Button, LoadingOverlay, Modal, Pill } from '@mantine/core';
import { Reagent } from '@/src/models/reagent';
import { uploadAddReagent, uploadDeleteReagent } from '@/src/services/reagentsDB';
import { CrudOperations, TableView } from '../components/Crud/Table/TableView';
import { ReagentEdit } from '../components/Reagents/ReagentEdit';
import { useData } from '../providers/DataProvider';
import { formattedSize } from '../utils/formatted-amount';

// FIXME: Quando acaba de adicionar, aparece ND no reagente, dependendo

export function ReagentsView() {
  const { reagents, loadingReagents, reagentsError, getReagentById } = useData();

  const initialCollumns = [
    {
      name: 'Nome',
      accessor: (reagent: Reagent) => reagent.name,
      fixed: true,
      sorter: (a: Reagent, b: Reagent) => a.name.trim().localeCompare(b.name.trim()),
      sortingPriority: 0,
    },
    {
      name: 'Dimensão',
      accessor: (reagent: Reagent) => reagent.dimension,
      fixed: false,
      sorter: (a: Reagent, b: Reagent) => a.dimension.trim().localeCompare(b.dimension.trim()),
      sortingPriority: null,
    },
    {
      name: 'Tamanhos',
      accessor: (reagent: Reagent) =>
        reagent.sizes.map((size, index) => <Pill key={index}>{formattedSize(size)}</Pill>),
      fixed: false,
      sortingPriority: null,
    },
  ];

  // STATES

  const [mode, setMode] = useState<'show' | 'edit' | 'table'>('table');
  const [selectedReagentId, setSelectedReagentId] = useState<string | null>(null);
  // const [search, setSearch] = useState('');
  // const [reagent, setFilteredReagent] = useState<Reagent | null>(null);

  const selectedReagent = useMemo(() => {
    return selectedReagentId ? getReagentById(selectedReagentId) : null;
  }, [reagents, selectedReagentId]);

  // HANDLERS

  // const handleChangeFilteredReagent = (reagent: Reagent | null) => {
  //   setFilteredReagent(reagent);
  // };

  // const handleSearchChange = (search: string) => {
  //   setSearch(search);
  // };

  const handleBeginReagentAddition = () => {
    setSelectedReagentId(null);
    setMode('edit');
  };

  const handleShowReagent = (reagent: Reagent) => {
    setSelectedReagentId(reagent.id);
    setMode('show');
  };

  const handleBeginReagentEdit = (reagent: Reagent) => {
    setSelectedReagentId(reagent.id);
    setMode('edit');
  };

  const handleAddReagent = (reagent: Reagent) => {
    uploadAddReagent(reagent);
    setSelectedReagentId(null);
  };

  const handleEditReagent = (reagent: Reagent) => {
    uploadAddReagent(reagent);
    setSelectedReagentId(null);
  };

  const handleDeleteReagent = (reagent: Reagent) => {
    uploadDeleteReagent(reagent);
  };

  const handleExitEdit = () => {
    setSelectedReagentId(null);
    setMode('table');
  };

  const crudOperations: CrudOperations<Reagent> = {
    handleShowData: handleShowReagent,
    handleBeginDataEdit: handleBeginReagentEdit,
    handleDeleteData: handleDeleteReagent,
  };

  // EFFECTS

  return (
    <>
      <h1>Itens</h1>

      {/* <SearchBar
        search={search}
        placeholder="Busque por nome de reagentes..."
        onChangeSearch={handleSearchChange}
        onChangeReagent={handleChangeFilteredReagent}
      /> */}
      <Box>
        {reagentsError ? (
          <p>ERRO</p>
        ) : loadingReagents ? (
          <LoadingOverlay visible />
        ) : (
          <TableView
            datas={reagents!}
            initialCollumns={initialCollumns}
            // search={search}
            searched={(reagent: Reagent) => reagent.name}
            crudOperations={crudOperations}
          />
        )}
      </Box>

      <Button
        style={{ position: 'fixed', bottom: '30px', right: '30px' }}
        onClick={handleBeginReagentAddition}
      >
        +
      </Button>

      {/* FIXME: Dados são apagados por fechamento "clicar fora" */}
      <Modal
        title={<strong>{selectedReagentId ? `Editar reagente` : `Adicionar reagente`}</strong>}
        opened={mode === 'edit'}
        onClose={handleExitEdit}
      >
        <ReagentEdit
          selectedReagent={selectedReagent}
          onAddReagent={handleAddReagent}
          itemModalOpened={mode === 'edit'}
          onEditReagent={handleEditReagent}
          onClose={handleExitEdit}
        />
      </Modal>
    </>
  );
}
