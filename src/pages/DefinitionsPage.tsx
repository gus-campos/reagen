'use client';

import { useState } from 'react';
import { collection } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Box, Button, Grid, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DefinitionModal } from '../components/Definitions/DefinitionModal';
import { Definition } from '../models/definition';
import {
  definitionConverter,
  uploadAddDefinition,
  uploadDeleteDefinition,
  uploadEditDefinition,
} from '../services/definitionsDB';
import { db } from '../utils/firebase';
import { CrudOperations, TableCollumn, TableView } from '../view/TableView';

const initialCollums: TableCollumn<Definition>[] = [
  {
    name: 'Nome',
    accessor: (definition: Definition) => definition.name,
  },
  {
    name: 'Dimensão',
    accessor: (definition: Definition) => definition.dimension,
  },
];

export function DefinitionPage() {
  const [definitions, loadingDefinitions, errorLoadingDefinitions] = useCollectionData<Definition>(
    collection(db, 'definitions').withConverter(definitionConverter)
  );

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
          loading={loadingDefinitions}
          errorLoading={!!errorLoadingDefinitions}
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
