import { Item } from '../models/item';

export function formattedAmount(item: Item) {
  return item.amount + ' ' + item.unit;
}
