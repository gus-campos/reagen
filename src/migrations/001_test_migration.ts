import { Item } from '../models/item';
import { itemConverter, itemsDocName } from '../services/itemsDB';
import { migrateFirebaseData } from './fireBaseMigration';

const migrator = (item: Item) => {
  const migrated: Item = {
    ...item,
    brand: item.brand ?? null,
    controlAgency: item.controlAgency ?? null,
  };
  return migrated;
};

migrateFirebaseData<Item>(itemsDocName, itemConverter, migrator);
