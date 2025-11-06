import { ItemGroup } from '../../grouped-stock/types/items-group';
import { ItemFilter } from '../../item-filter/types/items-filter';
import { useItemView } from '../modelviews/useItemView';
import { ItemLayout } from './ItemLayout';
import { ItemTable } from './ItemTable';

export type ItemViewProps = {
  filter?: ItemFilter;
  search?: string;
  group?: ItemGroup;
};

export type ViewMode = 'show' | 'edit' | 'table';

export function ItemView(props: ItemViewProps) {
  const { crudOperations, handleChangeMode, mode, selectedItem, handleSelectItem } = useItemView();

  return (
    <>
      <ItemLayout
        mode={mode}
        selectedItem={selectedItem}
        onModeChange={handleChangeMode}
        onSelectItem={handleSelectItem}
      />
      <ItemTable
        filter={props.filter}
        group={props.group}
        search={props.search}
        crudOperations={crudOperations}
      />
    </>
  );
}
