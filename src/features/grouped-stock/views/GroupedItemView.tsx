import { useState } from 'react';
import { Group, Paper, Title } from '@mantine/core';
import { useData } from '@/src/providers/DataProvider';
import { DataTable } from '../../data-table/components/DataTable';
import { TableCollumn } from '../../data-table/types/TableCollumn';
import { TableCrudOperations } from '../../data-table/types/TableCrudOperations';
import { getInitialCollumns } from '../../items/constants/getInitialCollumns';
import { Item } from '../../items/types/item';
import { formattedSize } from '../../reagents/utils/formatted-amount';
import { ItemGroup } from '../types/items-group';
import { groupItems } from '../utils/group-items';

export type ItemGroupViewProps = {
  search: string;
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

  const [selectedGroup, setSelectedGroup] = useState<ItemGroup>();

  const groupedItems = items ? groupItems(items) : [];

  const initialCollumns: TableCollumn<ItemGroup>[] = [
    {
      name: 'Quantidade',
      accessor: (group: ItemGroup) => group.items.length,
    },
    {
      name: 'Reagente',
      accessor: (group: ItemGroup) => getReagentById(group.reagentId).name,
    },
    {
      name: 'Tamanho',
      accessor: (group: ItemGroup) => formattedSize(group.size),
    },
  ];

  const crudOperations: TableCrudOperations<ItemGroup> = {};

  const itemCollumns = getInitialCollumns(
    {
      getReagentById,
      getBrandById,
      getControlAgencyById,
      getLaboratoryById,
      getSupplierById,
    },
    true
  );

  const ExpandedComponent = (group: ItemGroup) => {
    return (
      <Paper p="xl" style={{ backgroundColor: '#eee' }}>
        {/* TODO: Linhas mais escuras */}
        <Group justify="center">
          <Title
            order={3}
            mb="md"
          >{`${getReagentById(group.reagentId).name} ${formattedSize(group.size)}`}</Title>
        </Group>
        <DataTable<Item> datas={group.items} collumns={itemCollumns} />
      </Paper>
    );
  };

  // FIXME: Wrapper totalemente desnecessário, resquício de mudanças anteriores
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
