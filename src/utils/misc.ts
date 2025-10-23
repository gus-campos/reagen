import { Item } from '../models/item';
import { Reagent } from '../models/reagent';
import { Size } from '../models/size';
import { formattedSize } from './formatted-amount';

export function findRemovedSizes(before: Size[], after: Size[]) {
  return before.filter(
    (prevSize) =>
      !after.some((newSize) => prevSize.unit === newSize.unit && prevSize.amount === newSize.amount)
  );
}

export function findItemsOfReagentSizes(reagente: Reagent, sizes: Size[], items: Item[]) {
  // Assume que já carregou
  return items.filter(
    (item) =>
      item.reagentId === reagente.id &&
      sizes.some((size) => formattedSize(size) === formattedSize(item.size))
  );
}
