'use client';

import { useState } from 'react';
import { CiViewList } from 'react-icons/ci';
import { IoMdAdd } from 'react-icons/io';
import { Box, Button, Drawer, LoadingOverlay, Modal, Tabs } from '@mantine/core';
import { useData } from '@/src/providers/DataProvider';
import { DataTable } from '../../data-table/components/DataTable';
import { TableCrudOperations } from '../../data-table/types/TableCrudOperations';
import { ItemGroup } from '../../grouped-stock/types/items-group';
import { itemBelongsToGroup } from '../../grouped-stock/utils/item-belongs-to-group';
import { ItemFilter } from '../../item-filter/types/items-filter';
import { filteredItem } from '../../item-filter/utils/filtered-item';
import { ReagentService } from '../../reagents/services/ReagentService';
import { Reagent } from '../../reagents/types/reagent';
import { ReagentShow } from '../../reagents/views/ReagentShow';
import {
  getInitialCollumns,
  getSubGroupInitialCollumns,
  ItemCollumGetters,
} from '../constants/getInitialCollumns';
import { ItemService } from '../services/ItemService';
import { Item } from '../types/item';
import { ItemEdit } from './ItemEdit';
import { ItemShow } from './ItemShow';

export type ViewMode = 'simple' | 'grouped';

export type ItemViewProps = {
  filter?: ItemFilter;
  search?: string;
  group?: ItemGroup;
};

export function ItemView(props: ItemViewProps) {
  const {
    items,
    loadingItems,
    itemsError,
    getReagentById,
    getBrandById,
    getControlAgencyById,
    getLaboratoryById,
    getSupplierById,
  } = useData();

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const [mode, setMode] = useState<'show' | 'edit' | 'table'>('table');

  const getters: ItemCollumGetters = {
    getReagentById,
    getBrandById,
    getControlAgencyById,
    getLaboratoryById,
    getSupplierById,
  };

  const initialCollumns = props.group
    ? getSubGroupInitialCollumns(getters)
    : getInitialCollumns(getters);

  // HANDLERS

  const handleClickRow = (item: Item) => {
    setSelectedItem(item);
    setMode('show');
  };

  const handleBeginItemEdit = (item: Item) => {
    setSelectedItem(item);
    setMode('edit');
  };

  const handleDeleteItem = (item: Item) => {
    ItemService.instance.delete(item.id);
  };

  const handleAddReagent = (reagent: Reagent) => {
    ReagentService.instance.add(reagent);
  };
  const handleAddItem = (item: Item) => {
    ItemService.instance.add(item);
    setMode('table');
  };

  const handleEditItem = (item: Item) => {
    ItemService.instance.update(item.id, item);
    setMode('table');
  };

  const handleBeginItemAddition = () => {
    setSelectedItem(null);
    setMode('edit');
  };

  const crudOperations: TableCrudOperations<Item> = {
    handleBeginDataEdit: handleBeginItemEdit,
    handleDeleteData: handleDeleteItem,
    handleClickRow: handleClickRow,
  };

  const selectedItemReagent = selectedItem ? getReagentById(selectedItem.reagentId) : null;

  // Se for passado grupo, filtrar itens do grupo
  const definedItems = items ?? [];
  const allowedItems = props.group
    ? definedItems.filter((item) => itemBelongsToGroup(item, props.group!))
    : definedItems;

  const dataFilter = props.filter
    ? (item: Item) => filteredItem(item, getReagentById, props.filter!)
    : undefined;

  return (
    <>
      {itemsError ? (
        <p>ERRO</p>
      ) : loadingItems ? (
        // TODO: Inserir skeletons
        <LoadingOverlay visible />
      ) : (
        <DataTable<Item>
          datas={allowedItems}
          collumns={initialCollumns}
          search={props.search}
          searched={(item: Item) => getReagentById(item.reagentId).name}
          dataFilter={dataFilter}
          crudOperations={crudOperations}
          smallHeading={!!props.group}
        />
      )}

      {/* FIXME: Dados são apagados por fechamento "clicar fora" */}
      {/* Edição de item */}
      <Modal
        title={<strong>{selectedItem ? `Editar item` : `Adicionar item`}</strong>}
        opened={mode === 'edit'}
        onClose={() => setMode('table')}
      >
        <ItemEdit
          selectedItem={selectedItem}
          itemModalOpened={mode === 'edit'}
          onCloseItemModal={() => setMode('table')}
          onAddItem={handleAddItem}
          onEditItem={handleEditItem}
          onAddReagent={handleAddReagent}
          onBeginShownItemEdit={selectedItem ? () => handleBeginItemEdit(selectedItem) : () => {}}
        />
      </Modal>

      {/* Detalhamento de item */}
      <Drawer
        opened={mode === 'show'}
        onClose={() => setMode('table')}
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
            <ItemShow item={selectedItem!} />
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
