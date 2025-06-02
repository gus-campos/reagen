'use client';

import { useState } from 'react';
import { collection } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Box, Button, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ReagentsTable from '@/src/components/Table/ReagentsTable';
import {
  handleAddReagent,
  handleDeleteReagent,
  handleEditReagent,
  reagentConverter,
} from '@/src/services/reagents';
import Reagent from '@/src/typings/Reagent';
import { db } from '@/src/utils/firebase';
import ReagentModal from '../components/ReagentModal';

// selectedReagent --> selectedReagent

export default function TableView() {
  const [reagentModalOpened, { open: openReagentModal, close: closeReagentModal }] =
    useDisclosure(false);
  const [selectedReagent, setSelectedReagent] = useState<Reagent | null>(null);
  const [onShowMode, { open: activateShowMode, close: deactivateShowMode }] = useDisclosure(false);
  const [search, setSearch] = useState('');
  const [reagents, loadingReagents, errorLoadingReagents] = useCollectionData<Reagent>(
    collection(db, 'reagents').withConverter(reagentConverter)
  );

  const beginReagentEdit = (reagent: Reagent) => {
    setSelectedReagent(reagent);
    deactivateShowMode();
    openReagentModal();
  };

  const beginReagentAddition = () => {
    setSelectedReagent(null);
    deactivateShowMode();
    openReagentModal();
  };

  const handleShowReagent = (reagent: Reagent) => {
    setSelectedReagent(reagent);
    activateShowMode();
    openReagentModal();
  };

  // TODO: Separar drawer no layout em torno da visualização de tabela
  return (
    <>
      <ReagentModal
        onShowMode={onShowMode}
        selectedReagent={selectedReagent}
        reagentModalOpened={reagentModalOpened}
        closeReagentModal={closeReagentModal}
        handleAddReagent={handleAddReagent}
        handleEditReagent={handleEditReagent}
      />

      <h1>Reagentes</h1>

      {/* Search bar */}
      <Box style={{ padding: '15px 0 15px 0' }}>
        <TextInput
          placeholder={'Busque por nome de reagentes...'}
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          radius="md"
        />
      </Box>

      {/* Table */}
      {errorLoadingReagents ? (
        <p>ERRO AO CARREGAR DADOS!</p>
      ) : loadingReagents ? (
        <p>CARREGANDO DADOS...</p>
      ) : !reagents ? (
        <p>NENHUM DADO ENCONTRADO</p>
      ) : (
        <ReagentsTable
          reagents={reagents}
          search={search}
          handleDeleteReagent={handleDeleteReagent}
          beginReagentEdit={beginReagentEdit}
          handleShowReagent={handleShowReagent}
        />
      )}

      {/* Add button */}
      <Button
        style={{ position: 'fixed', bottom: '20px', right: '20px' }}
        onClick={beginReagentAddition}
      >
        +
      </Button>
    </>
  );
}
