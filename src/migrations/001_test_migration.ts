import { Item } from '../models/item';
import { ItemService } from '../services/ItemService';
import { migrateDB } from './migrateDB';

const migrator = (item: Item) => {
  const migrated: Item = {
    ...item,
    brandId: item.brandId ?? null,
  };
  return migrated;
};

migrateDB<Item>(ItemService.instance, migrator);
