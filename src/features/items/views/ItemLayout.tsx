'use client';

import { CiViewList } from 'react-icons/ci';
import { IoMdAdd } from 'react-icons/io';
import { Button, Drawer, Modal, Tabs } from '@mantine/core';
import { useData } from '@/src/providers/DataProvider';
import { ReagentService } from '../../reagents/services/ReagentService';
import { Reagent } from '../../reagents/types/reagent';
import { ReagentShow } from '../../reagents/views/ReagentShow';
import { ItemService } from '../services/ItemService';
import { Item } from '../types/item';
import { ItemEdit } from './ItemEdit';
import { ItemShow } from './ItemShow';
import { ViewMode } from './ItemView';

export type ItemViewProps = {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  selectedItem: Item | null;
  onSelectItem: (item: Item | null) => void;
  preFilledItemData?: Partial<Item>;
};

export function ItemLayout(props: ItemViewProps) {
  const { getReagentById } = useData();

  // HANDLERS

  const handleBeginItemEdit = (item: Item) => {
    props.onSelectItem(item);
    props.onModeChange('edit');
  };

  const handleAddReagent = (reagent: Reagent) => {
    ReagentService.instance.add(reagent);
  };
  const handleAddItem = (item: Item) => {
    ItemService.instance.add(item);
    props.onModeChange('table');
  };

  const handleEditItem = (item: Item) => {
    ItemService.instance.update(item.id, item);
    props.onModeChange('table');
  };

  const handleBeginItemAddition = () => {
    props.onSelectItem(null);
    props.onModeChange('edit');
  };

  const selectedItemReagent = props.selectedItem
    ? getReagentById(props.selectedItem.reagentId)
    : null;

  // FIXME: Ícones da coluna da tabela, na frente do botão!!

  return (
    <>
      {/* FIXME: Dados são apagados por fechamento "clicar fora" */}
      {/* Edição de item */}
      <Modal
        title={<strong>{props.selectedItem ? `Editar item` : `Adicionar item`}</strong>}
        opened={props.mode === 'edit'}
        onClose={() => props.onModeChange('table')}
      >
        <ItemEdit
          selectedItem={props.selectedItem}
          itemModalOpened={props.mode === 'edit'}
          onCloseItemModal={() => props.onModeChange('table')}
          onAddItem={handleAddItem}
          onEditItem={handleEditItem}
          onAddReagent={handleAddReagent}
          onBeginShownItemEdit={() => handleBeginItemEdit(props.selectedItem!)}
          preFilledItemData={props.preFilledItemData}
        />
      </Modal>

      {/* Detalhamento de item */}
      <Drawer
        opened={props.mode === 'show'}
        onClose={() => props.onModeChange('table')}
        overlayProps={{ backgroundOpacity: 0.1, blur: 0 }}
        position="right"
      >
        <Tabs defaultValue="overview">
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<CiViewList size="18px" />}>
              Visão geral
            </Tabs.Tab>
            <Tabs.Tab value="reagent" leftSection={<CiViewList size="18px" />}>
              Reagente
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="overview">
            <ItemShow item={props.selectedItem!} />
          </Tabs.Panel>
          <Tabs.Panel value="reagent">
            <ReagentShow reagent={selectedItemReagent!} />
          </Tabs.Panel>
        </Tabs>
      </Drawer>

      {/* Adicionar item */}
      <Button
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          borderRadius: '30px',
          height: '50px',
        }}
        onClick={handleBeginItemAddition}
      >
        <IoMdAdd size="20px" /> Cadastrar no estoque
      </Button>
    </>
  );
}
