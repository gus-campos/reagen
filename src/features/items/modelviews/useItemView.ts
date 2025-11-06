import { useState } from 'react';
import { TableCrudOperations } from '../../data-table/types/TableCrudOperations';
import { Item } from '../types/item';
import { ViewMode } from '../views/ItemView';

export function useItemView() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [mode, setMode] = useState<ViewMode>('table');

  const handleClickRow = (item: Item) => {
    setSelectedItem(item);
    setMode('show');
  };

  const handleBeginItemEdit = (item: Item) => {
    setSelectedItem(item);
    setMode('edit');
  };

  const crudOperations: TableCrudOperations<Item> = {
    handleBeginDataEdit: handleBeginItemEdit,
    handleClickRow: handleClickRow,
  };

  return {
    mode,
    selectedItem,
    handleSelectItem: (item: Item | null) => setSelectedItem(item),
    handleChangeMode: (mode: ViewMode) => setMode(mode),
    crudOperations,
  };
}
