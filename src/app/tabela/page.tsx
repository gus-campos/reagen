'use client';

import { useState } from 'react';
import { Button, Drawer, Menu, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ReagentFormModal from '@/src/components/ReagentFormModal';
import ReagentsTable from '@/src/components/ReagentsTable';
import ReagentData from '@/src/typings/ReagentData';
import Unit from '@/src/typings/Unit';

const initialReagentsData: ReagentData[] = [
  { id: 0, name: 'Sulfeto de Bário', amount: 1.54, unit: Unit.GRAMS },
  { id: 1, name: 'Cloreto de Sódio', amount: 44.6, unit: Unit.LITERS },
  { id: 2, name: 'Ácido Acético', amount: 12.3, unit: Unit.KILOGRAMS },
  { id: 3, name: 'Hidróxido de Sódio', amount: 5.7, unit: Unit.GRAMS },
  { id: 4, name: 'Nitrato de Prata', amount: 0.85, unit: Unit.GRAMS },
  { id: 5, name: 'Peróxido de Hidrogênio', amount: 25.0, unit: Unit.LITERS },
  { id: 6, name: 'Ácido Clorídrico', amount: 8.2, unit: Unit.LITERS },
  { id: 7, name: 'Carbonato de Cálcio', amount: 3.75, unit: Unit.GRAMS },
  { id: 8, name: 'Sulfato de Cobre', amount: 1.2, unit: Unit.GRAMS },
  { id: 9, name: 'Álcool Etílico', amount: 50.0, unit: Unit.LITERS },
  { id: 10, name: 'Amônia', amount: 2.9, unit: Unit.LITERS },
  { id: 11, name: 'Ácido Nítrico', amount: 4.5, unit: Unit.LITERS },
];

export default function TableView() {
  const [editedReagent, setEditedReagent] = useState<ReagentData | null>(null);
  const [reagentModalOpened, { open: openReagentModal, close: closeReagentModal }] =
    useDisclosure(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const [reagententsData, setReagentsData] = useState<ReagentData[]>(initialReagentsData);
  const [search, setSearch] = useState('');

  const handleDelete = (id: number) => {
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

  // Está carregando o formulário atualizado
  // Está editando

  // Fazer abrir modal quando clica
  // Depois botão de + sempre limpa form

  const handleAddReagent = (reagent: ReagentData) => {
    reagent.id = reagententsData.length;
    setReagentsData([...reagententsData, reagent]);
  };

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
        handleDelete={handleDelete}
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
