'use client';

import React, { useState } from 'react';
import { Box, Button, LoadingOverlay, Modal } from '@mantine/core';
import { ControlAgencyEditForm } from '../components/ControlAgency/ControlAgencyEditForm';
import { CrudOperations, TableView } from '../components/Crud/Table/TableView';
import { ControlAgency } from '../models/control-agency';
import { useAppData } from '../providers/DataProvider';
import { ControlAgencyService } from '../services/ControlAgencyService';

// FIXME: Quando acaba de adicionar, aparece ND no reagente, dependendo

export function ControlAgenciesView() {
  const {
    controlAgencies,
    loadingControlAgencies,
    controlAgenciesError,
    getControlAgencyById: getControlAgenciesById,
  } = useAppData();

  const initialCollumns = [
    {
      name: 'Orgão de Controle',
      accessor: (brand: ControlAgency) => brand.name,
      fixed: true,
      sorter: (a: ControlAgency, b: ControlAgency) => a.name.trim().localeCompare(b.name.trim()),
    },
  ];

  // STATES

  const [mode, setMode] = useState<'edit' | 'table'>('table');
  const [selectedControlAgencyId, setSelectedControlAgencyId] = useState<string | null>(null);

  const selectedControlAgency = selectedControlAgencyId
    ? getControlAgenciesById(selectedControlAgencyId)
    : null;

  // HANDLERS

  const handleBeginControlAgencyAddition = () => {
    setSelectedControlAgencyId(null);
    setMode('edit');
  };

  const handleBeginControlAgencyEdit = (controlAgency: ControlAgency) => {
    setSelectedControlAgencyId(controlAgency.id);
    setMode('edit');
  };

  const handleAddControlAgency = (controlAgency: ControlAgency) => {
    ControlAgencyService.instance.add(controlAgency);
    setSelectedControlAgencyId(null);
    setMode('table');
  };

  const handleEditControlAgency = (controlAgency: ControlAgency) => {
    ControlAgencyService.instance.update(controlAgency.id, controlAgency);
    setSelectedControlAgencyId(null);
    setMode('table');
  };

  const handleDeleteReagent = (controlAgency: ControlAgency) => {
    ControlAgencyService.instance.delete(controlAgency.id);
  };

  const handleExitEdit = () => {
    setSelectedControlAgencyId(null);
    setMode('table');
  };

  const crudOperations: CrudOperations<ControlAgency> = {
    handleShowData: () => {},
    handleBeginDataEdit: handleBeginControlAgencyEdit,
    handleDeleteData: handleDeleteReagent,
  };

  // EFFECTS

  // FIXME: Adicionar aviso de exclusão encadeada

  return (
    <span style={{ position: 'relative' }}>
      <h1>Orgãos de Controle</h1>

      <Box pb="80px">
        {controlAgenciesError ? (
          <p>ERRO</p>
        ) : loadingControlAgencies ? (
          <LoadingOverlay visible />
        ) : (
          <TableView
            datas={controlAgencies!}
            initialCollumns={initialCollumns}
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
        onClick={handleBeginControlAgencyAddition}
      >
        + Adicionar orgão de controle
      </Button>

      {/* FIXME: Dados são apagados por fechamento "clicar fora" */}
      <Modal
        title={
          <strong>
            {selectedControlAgencyId ? `Editar orgão de controle` : `Adicionar orgão de controle`}
          </strong>
        }
        opened={mode === 'edit'}
        onClose={handleExitEdit}
      >
        <ControlAgencyEditForm
          selectedControlAgency={selectedControlAgency!}
          onCancel={handleExitEdit}
          onAddControlAgency={handleAddControlAgency}
          onEditControlAgency={handleEditControlAgency}
        />
      </Modal>
    </span>
  );
}
