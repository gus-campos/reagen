import { useMemo, useState } from 'react';
import { Paper } from '@mantine/core';
import { useData } from '@/src/providers/DataProvider';
import { DataTable } from '../../data-table/components/DataTable';
import { TableCollumn } from '../../data-table/types/TableCollumn';
import { TableCrudOperations } from '../../data-table/types/TableCrudOperations';
import { ItemFilter } from '../../item-filter/types/items-filter';
import { filteredItem } from '../../item-filter/utils/filtered-item';
import { useItemView } from '../../items/modelviews/useItemView';
import { Item } from '../../items/types/item';
import { ItemLayout } from '../../items/views/ItemLayout';
import { ItemTable } from '../../items/views/ItemTable';
import { formattedSize } from '../../reagents/utils/formatted-amount';
import { ItemGroup } from '../types/items-group';
import { groupItems } from '../utils/group-items';

export type ItemGroupViewProps = {
  search: string;
  filter: ItemFilter;
};

export function ItemGroupView(props: ItemGroupViewProps) {
  const { items, getReagentById } = useData();
  const { crudOperations, handleChangeMode, handleSelectItem, mode, selectedItem } = useItemView();
  const [preFilledItemData, setPreFilledItemData] = useState<Partial<Item> | null>(null);

  const getExpandedComponent = (group: ItemGroup) => {
    return (
      <Paper p="sm" style={{ backgroundColor: '#eee' }}>
        <ItemTable filter={props.filter} group={group} crudOperations={crudOperations} />
      </Paper>
    );
  };

  // TODO: Seria bom ordenar por nome, e depois por tamanho
  const initialCollumns: TableCollumn<ItemGroup>[] = [
    {
      name: 'Reagente',
      accessor: (group) => getReagentById(group.reagentId).name,
      sorter: (a, b) =>
        getReagentById(a.reagentId).name.localeCompare(getReagentById(b.reagentId).name),
    },
    {
      name: 'Tamanho',
      accessor: (group) => formattedSize(group.size),
    },
    {
      name: 'Quantidade',
      accessor: (group) => group.items.length,
    },
  ];

  const groupedAndFilteredItems = useMemo(() => {
    const filteredItems = (items ?? []).filter((item) =>
      filteredItem(item, getReagentById, props.filter)
    );
    return groupItems(filteredItems);
  }, [items, getReagentById, props.filter]);

  const handleGetSearched = (group: ItemGroup) => getReagentById(group.reagentId).name;

  // const preFilledItemData = {};

  const handleChangeExpandedData = (item: ItemGroup | null) => {
    const preFilledData = item
      ? {
          reagentId: item.reagentId,
          size: item.size,
        }
      : null;

    setPreFilledItemData(preFilledData);
  };

  const groupCrudOperations: TableCrudOperations<ItemGroup> = {
    onChangeExpandedData: handleChangeExpandedData,
  };

  // FIX: Grupos não tem ordenação automatica nem opção?

  return (
    <>
      <DataTable<ItemGroup>
        datas={groupedAndFilteredItems}
        collumns={initialCollumns}
        search={props.search}
        searched={handleGetSearched}
        getExpandedComponent={getExpandedComponent}
        crudOperations={groupCrudOperations}
      />
      <ItemLayout
        mode={mode}
        onModeChange={handleChangeMode}
        onSelectItem={handleSelectItem}
        selectedItem={selectedItem}
        preFilledItemData={preFilledItemData ?? undefined}
      />
    </>
  );
}
