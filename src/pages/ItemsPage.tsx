'use client';

import React, { useState } from 'react';
import { CiViewList } from 'react-icons/ci';
import { IoMdAdd } from 'react-icons/io';
import { Box, Button, Drawer, Grid, LoadingOverlay, Modal, Tabs } from '@mantine/core';
import { Reagent } from '@/src/models/reagent';
import { FilterOptions } from '../components/Crud/Filter/FilterOptions';
import { SearchBar } from '../components/Crud/Filter/SearchBar';
import { CrudOperations, TableView } from '../components/Crud/Table/TableView';
import { getInitialCollumns } from '../components/Item/getInitialCollumns';
import { ItemEdit } from '../components/Item/ItemEdit';
import { ItemShow } from '../components/Item/ItemShow';
import { ReagentShow } from '../components/Reagents/ReagentShow';
import { Item } from '../models/item';
import { ItemsFilter } from '../models/items-filter';
import { useAppData } from '../providers/DataProvider';
import { ItemService } from '../services/ItemService';
import { ReagentService } from '../services/ReagentService';
import { filteredItem } from '../utils/filtered-item';

const initialFilter: ItemsFilter = {
  controlled: 'all',
  expired: 'all',
  maxExpire: null,
  minExpire: null,
  controlAgencyId: null,
};

export function ItemsPage() {
  const {
    items,
    loadingItems,
    itemsError,
    loadingControlAgencies,
    getReagentById,
    getBrandById,
    getControlAgencyById,
  } = useAppData();

  const initialCollumns = getInitialCollumns(getReagentById, getBrandById, getControlAgencyById);

  // STATES

  const [mode, setMode] = useState<'show' | 'edit' | 'table'>('table');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ItemsFilter>(initialFilter);

  // HANDLERS

  const handleAddReagent = (reagent: Reagent) => {
    ReagentService.instance.add(reagent);
  };

  const handleClickRow = (item: Item) => {
    setSelectedItem(item);
    setMode('show');
  };

  const handleSearchChange = (search: string) => {
    setSearch(search);
  };

  const handleFilterChange = (filter: ItemsFilter) => {
    setFilter(filter);
  };

  const handleBeginItemAddition = () => {
    setSelectedItem(null);
    setMode('edit');
  };

  const handleShowItem = (item: Item) => {
    setSelectedItem(item);
    setMode('show');
  };

  const handleBeginItemEdit = (item: Item) => {
    setSelectedItem(item);
    setMode('edit');
  };

  const handleAddItem = (item: Item) => {
    ItemService.instance.add(item);
    setMode('table');
  };

  const handleEditItem = (item: Item) => {
    ItemService.instance.update(item.id, item);
    setMode('table');
  };

  const handleDeleteItem = (item: Item) => {
    ItemService.instance.delete(item.id);
  };

  const crudOperations: CrudOperations<Item> = {
    handleShowData: handleShowItem,
    handleBeginDataEdit: handleBeginItemEdit,
    handleDeleteData: handleDeleteItem,
    handleClickRow: handleClickRow,
  };

  // CONSTS

  const selectedItemReagent = selectedItem ? getReagentById(selectedItem.reagentId) : null;

  return (
    <>
      <h1>Estoque</h1>

      <Grid>
        <Grid.Col span={{ base: 3 }}>
          {/* FIXME: E se não carregar? */}
          {!loadingControlAgencies && (
            <FilterOptions filter={filter} onFilterChange={handleFilterChange} />
          )}
        </Grid.Col>

        <Grid.Col span={{ base: 9 }}>
          <SearchBar
            search={search}
            placeholder="Busque por nome de reagentes..."
            onChangeSearch={handleSearchChange}
          />
          <Box>
            {itemsError ? (
              <p>ERRO</p>
            ) : loadingItems ? (
              <LoadingOverlay visible />
            ) : (
              <TableView
                datas={items!}
                initialCollumns={initialCollumns}
                search={search}
                searched={(item: Item) => getReagentById(item.reagentId).name}
                dataFilter={(item: Item) => filteredItem(item, getReagentById, filter)}
                crudOperations={crudOperations}
              />
            )}
          </Box>
        </Grid.Col>
      </Grid>

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

      {/* FIXME: Dados são apagados por fechamento "clicar fora" */}
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
    </>
  );
}
