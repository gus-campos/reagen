import { Item } from '@/src/features/items/types/item';
import { Size } from '@/src/features/reagents/types/size';

export function formattedAmount(item: Item) {
  return formattedSize(item.size);
}

export function formattedSize(size: Size) {
  return `${size.amount} ${size.unit}`;
}
