'use client';

import { useState } from 'react';
import { Button, Drawer, Menu, Table, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import AddReagentModal from '@/src/components/AddReagentModal';
import ReagentsTable from '@/src/components/ReagentsTable';
import ReagentData from '@/src/typings/ReagentData';
import Unit from '@/src/typings/Unit';

const initialReagentsData: ReagentData[] = [
  { id: 0, name: 'Sulfeto de Bário', amount: 1.54, unit: Unit.GRAMS },
  { id: 1, name: 'Cloreto de Sódio', amount: 44.6, unit: Unit.LITERS },
];

export default function TableView() {
  const [addModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const [reagententsData, setReagentsData] = useState<ReagentData[]>(initialReagentsData);
  const [search, setSearch] = useState('');

  const handleDelete = (id: number) => {
    setReagentsData(reagententsData.filter((item) => item.id != id));
  };

  const handleAddReagent = (reagent: ReagentData) => {
    reagent.id = reagententsData.length;
    setReagentsData([...reagententsData, reagent]);
  };

  return (
    // Falta heading, barra lateral

    <>
      <Drawer title="Opções" opened={drawerOpened} onClose={closeDrawer}>
        <Menu>
          <Menu.Item>Estoque</Menu.Item>
          <Menu.Item
            onClick={() => {
              openAddModal();
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
        handleDelete={handleDelete}
      />

      <AddReagentModal
        reagententsData={reagententsData}
        setReagentsData={setReagentsData}
        addModalOpened={addModalOpened}
        closeAddModal={closeAddModal}
        handleAddReagent={handleAddReagent}
      />

      <Button style={{ position: 'fixed', bottom: '20px', right: '20px' }} onClick={openAddModal}>
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
