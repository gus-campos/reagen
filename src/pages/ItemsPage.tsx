'use client';

import React, { useState } from 'react';
import { CiViewList } from 'react-icons/ci';
import { IoMdAdd } from 'react-icons/io';
import { Box, Button, Drawer, Grid, LoadingOverlay, Modal, Tabs, Text } from '@mantine/core';
import { TableCrudOperations } from '../features/data-table/types/TableCrudOperations';
import { TableView } from '../features/data-table/views/TableView';
import { filteredItem } from '../features/item-filter/utils/filtered-item';
import { FilterOptions } from '../features/item-filter/views/FilterOptions';
import { SearchBar } from '../features/item-filter/views/SearchBar';
import { getInitialCollumns } from '../features/items/constants/getInitialCollumns';
import { ItemService } from '../features/items/services/ItemService';
import { Item } from '../features/items/types/item';
import { ItemsFilter } from '../features/items/types/items-filter';
import { ItemEdit } from '../features/items/views/ItemEdit';
import { ItemShow } from '../features/items/views/ItemShow';
import { ReagentService } from '../features/reagents/services/ReagentService';
import { Reagent } from '../features/reagents/types/reagent';
import { ReagentShow } from '../features/reagents/views/ReagentShow';
import { useData } from '../providers/DataProvider';

const initialFilter: ItemsFilter = {
  controlled: 'all',
  expired: 'all',
  maxExpire: null,
  minExpire: null,
  controlAgencyId: null,
  brandId: null,
};

export function ItemsPage() {
  const {
    items,
    loadingItems,
    itemsError,
    controlAgenciesError,
    loadingControlAgencies,
    getReagentById,
    getBrandById,
    getControlAgencyById,
    getLaboratoryById,
  } = useData();

  const initialCollumns = getInitialCollumns(
    getReagentById,
    getBrandById,
    getControlAgencyById,
    getLaboratoryById
  );

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

  const crudOperations: TableCrudOperations<Item> = {
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

      {itemsError || controlAgenciesError ? (
        <p>ERRO</p>
      ) : loadingItems || loadingControlAgencies ? (
        // TODO: Inserir skeletons
        <LoadingOverlay visible />
      ) : (
        <>
          <Grid>
            <Grid.Col span={{ base: 3 }}>
              <FilterOptions filter={filter} onFilterChange={handleFilterChange} />
            </Grid.Col>

            <Grid.Col span={{ base: 9 }}>
              <SearchBar
                search={search}
                placeholder="Busque por nome de reagentes..."
                onChangeSearch={handleSearchChange}
              />
              <Box>
                <TableView
                  datas={items!}
                  initialCollumns={initialCollumns}
                  search={search}
                  searched={(item: Item) => getReagentById(item.reagentId).name}
                  dataFilter={(item: Item) => filteredItem(item, getReagentById, filter)}
                  crudOperations={crudOperations}
                />
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
              onBeginShownItemEdit={
                selectedItem ? () => handleBeginItemEdit(selectedItem) : () => {}
              }
            />
          </Modal>
        </>
      )}
    </>
  );
}
