'use client';

import { LoadingOverlay } from '@mantine/core';
import { useData } from '@/src/providers/DataProvider';
import { DataTable } from '../../data-table/components/DataTable';
import { TableCrudOperations } from '../../data-table/types/TableCrudOperations';
import { ItemGroup } from '../../grouped-stock/types/items-group';
import { itemBelongsToGroup } from '../../grouped-stock/utils/item-belongs-to-group';
import { ItemFilter } from '../../item-filter/types/items-filter';
import { filteredItem } from '../../item-filter/utils/filtered-item';
import {
  getInitialCollumns,
  getSubGroupInitialCollumns,
  ItemCollumGetters,
} from '../constants/getInitialCollumns';
import { ItemService } from '../services/ItemService';
import { Item } from '../types/item';

export type GroupViewMode = 'simple' | 'grouped';

export type ItemTableProps = {
  filter?: ItemFilter;
  search?: string;
  group?: ItemGroup;
  crudOperations?: TableCrudOperations<Item>;
};

export function ItemTable(props: ItemTableProps) {
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

  const handleDeleteItem = (item: Item) => {
    ItemService.instance.delete(item.id);
  };

  const crudOperations: TableCrudOperations<Item> = {
    handleDeleteData: handleDeleteItem,
  };

  const mergedCrudOperations = { ...crudOperations, ...props.crudOperations };

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
          crudOperations={mergedCrudOperations}
          smallHeading={!!props.group}
        />
      )}
    </>
  );
}
