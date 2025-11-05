import { Item } from '../../items/types/item';
import { areSizesEqual } from '../../reagents/utils/areSizesEqual';
import { ItemGroup } from '../types/items-group';

export function itemBelongsToGroup(item: Item, group: ItemGroup) {
  return item.reagentId === group.reagentId && areSizesEqual(item.size, group.size);
}
