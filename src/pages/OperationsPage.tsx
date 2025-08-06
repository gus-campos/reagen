'use client';

import { useState } from 'react';
import { Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Operation } from '../models/operation';
import { useData } from '../providers/DataProvider';
import { uploadDeleteOperation } from '../services/operationsDB';
import { formattedDate } from '../utils/formatted-date';
import { truncate } from '../utils/truncate';
import { CrudOperations, TableCollumn, TableView } from '../view/TableView';

export function OperationsPage() {
  const { operations, getReagentById, getDefinitionById } = useData();

  const [operationModalOpened, { open: openOperationModal, close: closeOperationModal }] =
    useDisclosure(false);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  const [showMode, { open: activateShowMode, close: deactivateShowMode }] = useDisclosure(false);

  const handleShowOperation = (operation: Operation) => {
    setSelectedOperation(operation);
    activateShowMode();
    openOperationModal();
  };

  const handleBeginOperationEdit = (operation: Operation) => {
    setSelectedOperation(operation);
    deactivateShowMode();
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
      name: 'Reagente',
      accessor: (operation: Operation) => {
        return (
          getDefinitionById(getReagentById(operation.reagentId)?.definitionId ?? '')?.name ??
          '[Não encontrado]'
        );
      },
    },
    {
      name: 'Tipo',
      accessor: (operation: Operation) => String(operation.type),
    },
    {
      name: 'Data',
      accessor: (operation: Operation) => formattedDate(operation.date),
    },
    {
      name: 'Observação',
      accessor: (operation: Operation) => truncate(operation.notes ?? '', 15),
    },
  ];

  return (
    <>
      <h1>Operações</h1>

      <Box w={'100%'}>
        <TableView
          initialCollumns={initialCollums}
          datas={operations}
          crudOperations={crudOperations}
        />
      </Box>
    </>
  );
}
