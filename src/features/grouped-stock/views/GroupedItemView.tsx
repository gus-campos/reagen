import { Group, Paper, Title } from '@mantine/core';
import { useData } from '@/src/providers/DataProvider';
import { DataTable } from '../../data-table/components/DataTable';
import { TableCollumn } from '../../data-table/types/TableCollumn';
import { TableCrudOperations } from '../../data-table/types/TableCrudOperations';
import { ItemFilter } from '../../item-filter/types/items-filter';
import { filteredItem } from '../../item-filter/utils/filtered-item';
import { getInitialCollumns } from '../../items/constants/getInitialCollumns';
import { ItemView } from '../../items/views/ItemView';
import { formattedSize } from '../../reagents/utils/formatted-amount';
import { ItemGroup } from '../types/items-group';
import { groupItems } from '../utils/group-items';

export type ItemGroupViewProps = {
  search: string;
  filter: ItemFilter;
};

export function ItemGroupView(props: ItemGroupViewProps) {
  const {
    items,
    getReagentById,
    getBrandById,
    getControlAgencyById,
    getLaboratoryById,
    getSupplierById,
  } = useData();

  const initialCollumns: TableCollumn<ItemGroup>[] = [
    {
      name: 'Reagente',
      accessor: (group: ItemGroup) => getReagentById(group.reagentId).name,
    },
    {
      name: 'Tamanho',
      accessor: (group: ItemGroup) => formattedSize(group.size),
    },
    {
      name: 'Quantidade',
      accessor: (group: ItemGroup) => group.items.length,
    },
  ];

  const crudOperations: TableCrudOperations<ItemGroup> = {};

  const itemCollumns = getInitialCollumns({
    getReagentById,
    getBrandById,
    getControlAgencyById,
    getLaboratoryById,
    getSupplierById,
  });

  const groupTableItemsCollums = [
    'Marca',
    'Laboratório',
    'Fornecedor',
    'Pureza',
    'Vencimeto',
    //
  ];

  const collumns = groupTableItemsCollums.map(
    (name) => itemCollumns.find((col) => col.name === name)!
  );

  const filteredItems = (items ?? []).filter((item) =>
    filteredItem(item, getReagentById, props.filter)
  );

  const groupedItems = groupItems(filteredItems);

  const ExpandedComponent = (group: ItemGroup) => {
    return (
      <Paper p="sm" style={{ backgroundColor: '#eee' }}>
        <ItemView filter={props.filter} group={group} />
      </Paper>
    );
  };

  // FIXME: Botão de adicionar item só aparece quando grupo está aberto

  return (
    <DataTable<ItemGroup>
      datas={groupedItems}
      collumns={initialCollumns}
      search={props.search}
      searched={(group) => getReagentById(group.reagentId).name}
      crudOperations={crudOperations}
      ExpandedComponent={ExpandedComponent}
    />
  );
}
