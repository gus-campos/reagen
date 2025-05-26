'use client';

import { useState } from 'react';
import { collection } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Button, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ReagentFormModal from '@/src/components/ReagentFormModal';
import ReagentsTable from '@/src/components/ReagentsTable';
import SideDrawer from '@/src/components/SideDrawer';
import {
  handleAddReagent,
  handleDeleteReagent,
  handleEditReagent,
  reagentConverter,
} from '@/src/services/reagents';
import Reagent from '@/src/typings/Reagent';
import { db } from '@/src/utils/firebase';

export default function TableView() {
  const [editedReagent, setEditedReagent] = useState<Reagent | null>(null);
  const [reagentModalOpened, { open: openReagentModal, close: closeReagentModal }] =
    useDisclosure(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const [search, setSearch] = useState('');

  const [reagents, loadingReagents, errorLoadingReagents] = useCollectionData<Reagent>(
    collection(db, 'reagents').withConverter(reagentConverter)
  );

  const beginReagentEdit = (reagent: Reagent) => {
    setEditedReagent(reagent);
    openReagentModal();
  };

  // TODO: Separar drawer no layout em torno da visualização de tabela
  return (
    <>
      {/* Layout drawer */}
      <SideDrawer
        drawerOpened={drawerOpened}
        closeDrawer={closeDrawer}
        openReagentModal={openReagentModal}
      />

      {/* Search bar */}
      <TextInput value={search} onChange={(event) => setSearch(event.currentTarget.value)} />

      {/* Table */}
      {errorLoadingReagents ? (
        <h1>ERRO AO CARREGAR DADOS!</h1>
      ) : loadingReagents ? (
        <h1>CARREGANDO DADOS...</h1>
      ) : !reagents ? (
        <h1>NENHUM DADO ENCONTRADO</h1>
      ) : (
        <ReagentsTable
          reagents={reagents}
          search={search}
          handleDeleteReagent={handleDeleteReagent}
          beginReagentEdit={beginReagentEdit}
        />
      )}

      {/* Modal to add or edit reagents */}
      <ReagentFormModal
        editedReagent={editedReagent}
        reagentModalOpened={reagentModalOpened}
        closeReagentModal={closeReagentModal}
        handleAddReagent={handleAddReagent}
        handleEditReagent={handleEditReagent}
      />

      {/* Add button */}
      <Button
        style={{ position: 'fixed', bottom: '20px', right: '20px' }}
        onClick={() => {
          setEditedReagent(null);
          openReagentModal();
        }}
      >
        +
      </Button>

      {/* Drawer button */}
      <Button
        style={{ position: 'fixed', bottom: '20px', left: '20px' }}
        variant="default"
        onClick={openDrawer}
      >
        Opções
      </Button>
    </>
  );
}
