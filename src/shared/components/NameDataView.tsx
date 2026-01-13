'use client';

import React, { useState } from 'react';
import { Box, Button, LoadingOverlay, Modal } from '@mantine/core';
import { TableCrudOperations } from '@/src/features/data-table/data-table.type';
import { DataTable } from '@/src/features/data-table/data-table.view';
import { DataService } from '../services/data.service';
import { NameData } from '../types/name-data';
import { ConfirmModal } from './ConfirmModal';
import { NameDataEdit } from './NameDataEdit';

type NameDataViewProps<T extends NameData> = {
  datas?: T[];
  dataName: string;
  dataService: DataService<T>;
  getDeleteWarning: (data: T) => string | null;
  loadingData: boolean;
};

export function NameDataView<T extends NameData>(props: NameDataViewProps<T>) {
  const initialCollumns = [
    {
      name: 'Nome',
      accessor: (data: T) => data.name,
      fixed: true,
      sorter: (a: T, b: T) => a.name.trim().localeCompare(b.name.trim()),
    },
  ];

  // STATES

  const [mode, setMode] = useState<'edit' | 'table'>('table');
  const [selectedDataId, setSelectedDataId] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const selectedData =
    selectedDataId && !props.loadingData
      ? props.datas!.find((data) => data.id === selectedDataId)!
      : null;

  // HANDLERS

  const handleBeginDataAdd = () => {
    setSelectedDataId(null);
    setMode('edit');
  };

  const handleBeginDataEdit = (data: T) => {
    setSelectedDataId(data.id);
    setMode('edit');
  };

  const handleAddData = (data: T) => {
    props.dataService.add(data);
    setSelectedDataId(null);
    setMode('table');
  };

  const handleEditData = (data: T) => {
    props.dataService.update(data.id, data);
    setSelectedDataId(null);
    setMode('table');
  };

  const handleDeleteData = (data: T) => {
    const message = props.getDeleteWarning(data);

    if (message !== null) {
      // Mensagem
      setWarning(message);
      setSelectedDataId(data.id);
    } else {
      // Deleta
      props.dataService.delete(data.id!);
    }
  };

  const handleConfirmDataDelete = () => {
    props.dataService.delete(selectedDataId!);
    handleExitConfirmation();
    setWarning(null);
  };

  const handleExitConfirmation = () => {
    setSelectedDataId(null);
    setWarning(null);
  };

  const handleExitEdit = () => {
    setSelectedDataId(null);
    setMode('table');
  };

  const crudOperations: TableCrudOperations<T> = {
    handleBeginDataEdit,
    handleDeleteData,
  };

  return (
    <>
      {props.loadingData ? (
        <LoadingOverlay visible />
      ) : (
        <>
          <span style={{ position: 'relative' }}>
            <h1>Marcas</h1>

            <Box pb="80px">
              <DataTable<T>
                datas={props.datas!}
                collumns={initialCollumns}
                crudOperations={crudOperations}
              />
            </Box>

            {/* FIXME: BOtão fica mal posicionado no firefox */}
            <Button
              style={{
                position: 'absolute',
                bottom: '5px',
                right: '30px',
                height: '40px',
                borderRadius: '50px',
              }}
              onClick={handleBeginDataAdd}
            >
              + Adicionar marca
            </Button>

            {/* FIXME: Dados são apagados por fechamento "clicar fora" */}
            <Modal
              title={
                <strong>
                  {selectedDataId ? `Editar ${props.dataName}` : `Adicionar ${props.dataName}`}
                </strong>
              }
              opened={mode === 'edit'}
              onClose={handleExitEdit}
            >
              <NameDataEdit
                selectedData={selectedData!}
                onCancel={handleExitEdit}
                onAddData={handleAddData}
                onEditData={handleEditData}
              />
            </Modal>
          </span>
          <ConfirmModal
            opened={warning !== null}
            onClose={handleExitConfirmation}
            onConfirm={handleConfirmDataDelete}
          >
            {warning}
          </ConfirmModal>
        </>
      )}
    </>
  );
}
