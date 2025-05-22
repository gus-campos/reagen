'use client';

import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { Button, Drawer, Menu, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ReagentFormModal from '@/src/components/ReagentFormModal';
import ReagentsTable from '@/src/components/ReagentsTable';
import ReagentData from '@/src/typings/ReagentData';

const firebaseConfig = {
  apiKey: 'AIzaSyCaldii3iEgvnubFwjL93F3YofhPnSERC8',
  authDomain: 'reagentcontrol.firebaseapp.com',
  projectId: 'reagentcontrol',
  storageBucket: 'reagentcontrol.firebasestorage.app',
  messagingSenderId: '1056614611242',
  appId: '1:1056614611242:web:09fa4a40ff7bad28838653',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function TableView() {
  // FIXME:Devia ser a id?
  const [editedReagent, setEditedReagent] = useState<ReagentData | null>(null);
  const [reagentModalOpened, { open: openReagentModal, close: closeReagentModal }] =
    useDisclosure(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const [reagententsData, setReagentsData] = useState<ReagentData[]>([]);
  const [search, setSearch] = useState('');

  // Carregar dados da primeira vez usar set state
  // Ao fazer post, guardar ID na lista interna, mas não postar!

  const handleAddReagent = (reagent: ReagentData) => {
    reagent.id = reagententsData.length;
    setReagentsData([...reagententsData, reagent]);
  };

  const handleDeleteReagent = (id: number) => {
    setReagentsData(reagententsData.filter((item) => item.id != id));
  };

  const handleEditReagent = (editedReagent: ReagentData) => {
    setReagentsData(
      reagententsData.map((reagent) => (reagent.id == editedReagent.id ? editedReagent : reagent))
    );

    setEditedReagent(null);
  };

  const beginReagentEdit = (reagent: ReagentData) => {
    setEditedReagent(reagent);
    openReagentModal();
  };

  useEffect(() => {
    async function updateRemote() {
      const colRef = collection(db, 'reagents');
      const snapshot = await getDocs(colRef);

      const remoteReagentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      for (const reagentData of remoteReagentData) {
      }

      // Se id remota não está mais presente localmente, excluir remoto
      // Encontrando os remotos que não estão entre os locais

      // Se id null, adicionar doc no remoto e atribuir o id ao local
      // Encontrando local com id null

      // Se id presente no local e remoto, mas timestamp diferente, substituir/ editar
      // Encontrar os remotos que estão com timestamp diferentes
      // Buscar o par remoto correspondente e comparar timestamps
    }

    updateRemote();
  }, [reagententsData]);

  return (
    <>
      <Drawer title="Opções" opened={drawerOpened} onClose={closeDrawer}>
        <Menu>
          <Menu.Item>Estoque</Menu.Item>
          <Menu.Item
            onClick={() => {
              openReagentModal();
              closeDrawer();
            }}
          >
            Adicionar reagentente
          </Menu.Item>
        </Menu>
      </Drawer>
      <TextInput value={search} onChange={(event) => setSearch(event.currentTarget.value)} />
      <ReagentsTable
        reagententsData={reagententsData}
        search={search}
        handleDeleteReagent={handleDeleteReagent}
        beginReagentEdit={beginReagentEdit}
      />
      <ReagentFormModal
        editedReagent={editedReagent}
        setReagentsData={setReagentsData}
        reagentModalOpened={reagentModalOpened}
        closeReagentModal={closeReagentModal}
        handleAddReagent={handleAddReagent}
        handleEditReagent={handleEditReagent}
      />

      <Button
        style={{ position: 'fixed', bottom: '20px', right: '20px' }}
        onClick={() => {
          setEditedReagent(null);
          openReagentModal();
        }}
      >
        +
      </Button>

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
