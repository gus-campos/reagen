'use client';

import React, { useMemo, useState } from 'react';
import { Box, Button, LoadingOverlay, Modal, Pill } from '@mantine/core';
import { findItemsOfReagent } from '@/src/shared/utils/misc';
import { useData } from '../../../providers/DataProvider';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';
import { DataTable } from '../../data-table/components/DataTable';
import { TableCrudOperations } from '../../data-table/types/TableCrudOperations';
import { SearchBar } from '../../item-filter/views/SearchBar';
import { Item } from '../../items/types/item';
import { ReagentService } from '../services/ReagentService';
import { Reagent } from '../types/reagent';
import { formattedSize } from '../utils/formatted-amount';
import { ReagentEdit } from './ReagentEdit';

export function ReagentsView() {
  const { reagents, loadingReagents, reagentsError, items, getReagentById, getControlAgencyById } =
    useData();

  const getAgencyName = (reagent: Reagent) => {
    return reagent.controlAgencyId ? getControlAgencyById(reagent.controlAgencyId).name : '--';
  };

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
    {
      name: 'Orgão de Controle',
      accessor: (reagent: Reagent) => getAgencyName(reagent),
      fixed: false,
      sorter: (a: Reagent, b: Reagent) =>
        getAgencyName(a).trim().localeCompare(getAgencyName(b).trim()),
      sortingPriority: null,
    },
  ];

  // STATES

  const [mode, setMode] = useState<'show' | 'edit' | 'table'>('table');
  const [selectedReagentId, setSelectedReagentId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [warning, setWarning] = useState<string | null>(null);

  const selectedReagent = useMemo(() => {
    return selectedReagentId ? getReagentById(selectedReagentId) : null;
  }, [reagents, selectedReagentId]);

  // HANDLERS

  const handleSearchChange = (search: string) => {
    setSearch(search);
  };

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
    ReagentService.instance.add(reagent);
    setSelectedReagentId(null);
  };

  const handleEditReagent = (reagent: Reagent) => {
    ReagentService.instance.update(reagent.id, reagent);
    setSelectedReagentId(null);
  };

  const handleDeleteReagent = (reagent: Reagent) => {
    const relatedItems = findItemsOfReagent(reagent, items!);

    if (relatedItems.length > 0) {
      setSelectedReagentId(reagent.id);
      setWarning(getConfirmationMessage(reagent, relatedItems));
    } else {
      ReagentService.instance.delete(reagent.id);
    }
  };

  const handleConfirmReagentDelete = () => {
    ReagentService.instance.delete(selectedReagentId!);
    setSelectedReagentId(null);
    setWarning(null);
  };

  const handleExitConfirmation = () => {
    setWarning(null);
    setSelectedReagentId(null);
  };

  const handleExitEdit = () => {
    setSelectedReagentId(null);
    setMode('table');
  };

  const crudOperations: TableCrudOperations<Reagent> = {
    handleClickRow: handleShowReagent,
    handleBeginDataEdit: handleBeginReagentEdit,
    handleDeleteData: handleDeleteReagent,
  };

  // AUX

  const getConfirmationMessage = (reagent: Reagent, relatedItems: Item[]) => {
    return `Excluir o reagente: ${reagent.name}
      Causará a exclusão dos seguintes itens:
      ${relatedItems.map((item) => `* ${item.id}`).join('\n')}
      `;
  };

  return (
    <>
      <span style={{ position: 'relative' }}>
        <h1>Reagentes</h1>

        <SearchBar
          search={search}
          placeholder="Busque por nome de reagentes..."
          onChangeSearch={handleSearchChange}
        />
        <Box pb="80px">
          {reagentsError ? (
            <p>ERRO</p>
          ) : loadingReagents ? (
            <LoadingOverlay visible />
          ) : (
            <DataTable<Reagent>
              datas={reagents!}
              collumns={initialCollumns}
              search={search}
              searched={(reagent: Reagent) => reagent.name}
              crudOperations={crudOperations}
            />
          )}
        </Box>

        <Button
          style={{
            position: 'absolute',
            bottom: '5px',
            right: '30px',
            height: '40px',
            borderRadius: '50px',
          }}
          onClick={handleBeginReagentAddition}
        >
          + Adicionar reagente
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
      </span>
      <ConfirmModal
        opened={warning !== null}
        onClose={handleExitConfirmation}
        onConfirm={handleConfirmReagentDelete}
      >
        {warning}
      </ConfirmModal>
    </>
  );
}
