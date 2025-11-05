import { ItemService } from '@/src/features/items/services/ItemService';
import { Item } from '@/src/features/items/types/item';
import { migrateDB } from './migrateDB';

const migrator = (item: Item) => {
  const migrated: Item = {
    ...item,
    brandId: item.brandId ?? null,
  };
  return migrated;
};

migrateDB<Item>(ItemService.instance, migrator);
