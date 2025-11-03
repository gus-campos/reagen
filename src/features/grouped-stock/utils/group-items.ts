import { Item } from '../../items/types/item';
import { ItemGroup } from '../types/items-group';
import { itemBelongsToGroup } from './item-belongs-to-group';

export function groupItems(items: Item[]) {
  return (
    items.reduce((acc: ItemGroup[], item: Item) => {
      const group = acc.find((group) => itemBelongsToGroup(item, group));

      if (group) {
        return acc.map((group) => {
          if (itemBelongsToGroup(item, group)) {
            console.log('group', group);
            return { ...group, items: [...group.items, item] };
          } else return group;
        });
      } else {
        return [
          ...acc,
          { reagentId: item.reagentId, size: item.size, items: [item] },
        ] as ItemGroup[];
      }
    }, []) ?? []
  );
}
