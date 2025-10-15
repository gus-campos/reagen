import { Item } from '../models/item';
import { Size } from '../models/size';

export function formattedAmount(item: Item) {
  return formattedSize(item.size);
}

export function formattedSize(size: Size) {
  return `${size.amount  } ${  size.unit}`;
}
