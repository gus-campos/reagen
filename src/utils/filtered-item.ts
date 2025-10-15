import { Item } from '../models/item';
import ItemsFilter from '../models/items-filter';
import { UnitDimension } from '../models/unit';
import { normalizedAmount } from './normalized-amount';

export function filteredItem(item: Item, filter: ItemsFilter): boolean {
  return filteredDate(item, filter) && filteredAmount(item, filter);
}

function filteredDate(item: Item, filter: ItemsFilter): boolean {
  if (!item.expireDate) {return false;}

  if (filter.minDate && item.expireDate < filter.minDate) {return false;}
  if (filter.maxDate && item.expireDate > filter.maxDate) {return false;}

  return true;
}

function filteredAmount(item: Item, filter: ItemsFilter): boolean {
  if (!filter.dimension) {return true;}

  const itemDimension = UnitDimension[item.unit];
  if (itemDimension !== filter.dimension) {return false;}

  if (filter.minAmount && normalizedAmount(item) < filter.minAmount) {return false;}
  if (filter.maxAmount && normalizedAmount(item) > filter.maxAmount) {return false;}

  return true;
}
