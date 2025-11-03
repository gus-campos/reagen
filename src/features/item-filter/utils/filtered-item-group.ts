import { ItemGroup } from '../../grouped-stock/types/items-group';
import { Item } from '../../items/types/item';
import { Reagent } from '../../reagents/types/reagent';
import { ItemFilter } from '../types/items-filter';
import { filteredItem } from './filtered-item';

export function filteredItemGroup(
  group: ItemGroup,
  getReagentById: (id: string) => Reagent,
  filter: ItemFilter
) {
  const mergeItem: Item = {
    id: '',

    brandId: null,
    laboratoryId: null,
    supplierId: null,

    purity: 0,
    reagentId: group.reagentId,
    size: group.size,

    inDate: new Date(),
    expireDate: new Date(),
    outDate: new Date(),
  };

  return filteredItem(mergeItem, getReagentById, filter);
}
