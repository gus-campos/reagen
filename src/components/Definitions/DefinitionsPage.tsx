'use client';

import { useState } from 'react';
import { Box, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Definition } from '../../models/definition';
import { useData } from '../../providers/DataProvider';
import {
  uploadAddDefinition,
  uploadDeleteDefinition,
  uploadEditDefinition,
} from '../../services/definitionsDB';
import { CrudOperations, TableCollumn, TableView } from '../Crud/Table/TableView';
import { DefinitionModal } from './DefinitionModal';

const initialCollums: TableCollumn<Definition>[] = [
  {
    name: 'Nome',
    accessor: (definition: Definition) => definition.name,
    sorter: (a: Definition, b: Definition) => a.name.trim().localeCompare(b.name.trim()),
  },
  {
    name: 'Dimensão',
    accessor: (definition: Definition) => definition.dimension,
    sorter: (a: Definition, b: Definition) => a.dimension.trim().localeCompare(b.dimension.trim()),
  },
];

export function DefinitionsPage() {
  const { definitions } = useData();
  const [definitionModalOpened, { open: openDefinitionModal, close: closeDefinitionModal }] =
    useDisclosure(false);
  const [selectedDefinition, setSelectedDefinition] = useState<Definition | null>(null);
  const [showMode, { open: activateShowMode, close: deactivateShowMode }] = useDisclosure(false);

  const handleBeginDefinitionAddition = () => {
    setSelectedDefinition(null);
    deactivateShowMode();
    openDefinitionModal();
  };

  const handleShowDefinition = (definition: Definition) => {
    setSelectedDefinition(definition);
    activateShowMode();
    openDefinitionModal();
  };

  const handleBeginDefinitionEdit = (definition: Definition) => {
    setSelectedDefinition(definition);
    deactivateShowMode();
    openDefinitionModal();
  };

  const handleAddDefinition = (definition: Definition) => {
    uploadAddDefinition(definition);
    closeDefinitionModal();
  };

  const handleEditDefinition = (definition: Definition) => {
    uploadEditDefinition(definition);
    closeDefinitionModal();
  };

  const handleDeleteDefinition = (definition: Definition) => {
    uploadDeleteDefinition(definition);
  };

  const crudOperations: CrudOperations<Definition> = {
    handleShowData: handleShowDefinition,
    handleBeginDataEdit: handleBeginDefinitionEdit,
    handleDeleteData: handleDeleteDefinition,
  };

  return (
    <>
      <h1>Definições</h1>

      <Box w={'100%'}>
        <TableView
          initialCollumns={initialCollums}
          datas={definitions}
          crudOperations={crudOperations}
        />
      </Box>

      {/* Add button */}
      <Button
        style={{ position: 'fixed', bottom: '30px', right: '30px' }}
        onClick={handleBeginDefinitionAddition}
      >
        +
      </Button>

      <DefinitionModal
        onAddDefinition={handleAddDefinition}
        onBeginShownDefinitionEdit={
          selectedDefinition ? () => handleBeginDefinitionEdit(selectedDefinition) : () => {}
        }
        onCloseDefinitionModal={closeDefinitionModal}
        onEditDefinition={handleEditDefinition}
        definitionModalOpened={definitionModalOpened}
        selectedDefinition={selectedDefinition}
        showMode={showMode}
      />
    </>
  );
}
