'use client';

import React, { useState } from 'react';
import { CiViewList } from 'react-icons/ci';
import {
  AppShell,
  Box,
  Button,
  Drawer,
  Grid,
  Modal,
  Paper,
  Stack,
  Tabs,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Reagent } from '@/src/models/reagent';
import { uploadAddReagent } from '@/src/services/reagentsDB';
import { Item } from '../../models/item';
import { ItemsFilter } from '../../models/items-filter';
import { useData } from '../../providers/DataProvider';
import { uploadAddItem, uploadDeleteItem, uploadEditItem } from '../../services/itemsDB';
import { filteredItem } from '../../utils/filtered-item';
import { formattedAmount } from '../../utils/formatted-amount';
import { formattedDate } from '../../utils/formatted-date';
import { normalizedAmount } from '../../utils/normalized-amount';
import { FilterOptions } from '../Crud/Filter/FilterOptions';
import { CrudOperations, TableCollumn, TableView } from '../Crud/Table/TableView';
import { ItemEdit } from './ItemEdit';
import { ItemShow } from './ItemShow';

const initialFilter: ItemsFilter = {
  expired: null,
  minDate: null,
  maxDate: null,
  dimension: null,
  minAmount: null,
  maxAmount: null,
};

export function ItemsPage() {
  const { items, loadingItems, itemsError, getReagentById } = useData();
  const [itemDrawerOpened, { open: openItemDrawer, close: closeItemDrawer }] = useDisclosure(false);
  const [itemModalOpened, { open: openItemModal, close: closeItemModal }] = useDisclosure(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showMode, { open: activateShowMode, close: deactivateShowMode }] = useDisclosure(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ItemsFilter>(initialFilter);
  const [reagent, setFilteredReagent] = useState<Reagent | null>(null);

  const handleClickRow = (item: Item) => {
    setSelectedItem(item);
    openItemDrawer();
  };

  const handleSearchChange = (search: string) => {
    setSearch(search);
  };

  const handleFilterChange = (filter: ItemsFilter) => {
    setFilter(filter);
  };

  const handleBeginItemAddition = () => {
    setSelectedItem(null);
    deactivateShowMode();
    openItemModal();
  };

  const handleShowItem = (item: Item) => {
    setSelectedItem(item);
    activateShowMode();
    openItemDrawer();
  };

  const handleBeginItemEdit = (item: Item) => {
    setSelectedItem(item);
    deactivateShowMode();
    openItemModal();
  };

  const handleAddItem = (item: Item) => {
    uploadAddItem(item);
    closeItemModal();
  };

  const handleEditItem = (item: Item) => {
    uploadEditItem(item);
    closeItemModal();
  };

  const handleDeleteItem = (item: Item) => {
    uploadDeleteItem(item);
  };

  const handleChangeFilteredReagent = (reagent: Reagent | null) => {
    setFilteredReagent(reagent);
  };

  const handleAddReagent = (reagent: Reagent) => {
    uploadAddReagent(reagent);
  };

  const crudOperations: CrudOperations<Item> = {
    handleShowData: handleShowItem,
    handleBeginDataEdit: handleBeginItemEdit,
    handleDeleteData: handleDeleteItem,
  };

  const initialCollumns: TableCollumn<Item>[] = [
    {
      name: 'Definição',
      accessor: (item: Item) => getReagentById(item.reagentId)?.name ?? 'ND',
      hidden: false,
      fixed: true,
      ascending: false,
      sorter: (a: Item, b: Item) =>
        (getReagentById(a.reagentId)?.name ?? '')
          .trim()
          .localeCompare((getReagentById(b.reagentId)?.name ?? '').trim()),
      sortingPriority: 0,
    },
    {
      name: 'Quantidade',
      accessor: (item: Item) => formattedAmount(item),
      hidden: false,
      fixed: false,
      ascending: null,
      sorter: (a: Item, b: Item) => normalizedAmount(a) - normalizedAmount(b),
      sortingPriority: null,
    },
    {
      name: 'Pureza',
      accessor: (item: Item) => (item.purity ? `${item.purity} %` : ''),
      hidden: false,
      fixed: false,
      ascending: null,
      sorter: (a: Item, b: Item) => a.purity - b.purity,
      sortingPriority: null,
    },
    {
      name: 'Vencimeto',
      accessor: (item: Item) => formattedDate(item.expireDate),
      hidden: false,
      fixed: false,
      ascending: null,
      sorter: (a: Item, b: Item) =>
        (a.expireDate?.getTime() ?? Infinity) - (b.expireDate?.getTime() ?? Infinity),
      sortingPriority: null,
    },
  ];

  return (
    <>
      <h1>Items</h1>
      <Grid>
        <Grid.Col span={{ base: 3 }}>
          <FilterOptions
            search={search}
            filter={filter}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
            onReagentChange={handleChangeFilteredReagent}
            reagent={reagent}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 9 }}>
          <Box w={'100%'}>
            {itemsError ? (
              <p>ERRO</p>
            ) : loadingItems ? (
              <p>CARREGANDO DADOS...</p>
            ) : (
              <TableView
                datas={items!}
                initialCollumns={initialCollumns}
                search={search}
                searched={(item: Item) => getReagentById(item.reagentId)?.name ?? ''}
                dataFilter={(item: Item) => filteredItem(item, filter)}
                crudOperations={crudOperations}
                handleClickRow={handleClickRow}
              />
            )}
          </Box>
        </Grid.Col>
      </Grid>

      <Button
        style={{ position: 'fixed', bottom: '30px', right: '30px' }}
        onClick={handleBeginItemAddition}
      >
        +
      </Button>

      <Drawer
        opened={itemDrawerOpened}
        onClose={closeItemDrawer}
        overlayProps={{ backgroundOpacity: 0.1, blur: 0 }}
        position="right"
      >
        <Tabs defaultValue="overview">
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<CiViewList size="18px" />}>
              Visão geral
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="overview">
            {selectedItem ? <ItemShow item={selectedItem} /> : <Text>Selecione um item</Text>}
          </Tabs.Panel>
        </Tabs>
      </Drawer>

      {/* FIXME: Dados são apagados por fechamento "clicar fora" */}
      <Modal
        title={<strong>{selectedItem ? `Editar item` : `Adicionar item`}</strong>}
        opened={itemModalOpened}
        onClose={closeItemModal}
      >
        <ItemEdit
          showMode={showMode}
          selectedItem={selectedItem}
          itemModalOpened={itemModalOpened}
          onCloseItemModal={closeItemModal}
          onAddItem={handleAddItem}
          onEditItem={handleEditItem}
          onAddReagent={handleAddReagent}
          onBeginShownItemEdit={selectedItem ? () => handleBeginItemEdit(selectedItem) : () => {}}
        />
      </Modal>
    </>
  );
}
