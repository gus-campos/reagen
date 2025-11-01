import { Brand } from '@/src/features/brands/types/brand';
import { ControlAgency as Laboratory } from '@/src/features/control-agency/types/control-agency';
import { Item } from '@/src/features/items/types/item';
import { Reagent } from '@/src/features/reagents/types/reagent';
import { Size } from '@/src/features/reagents/types/size';
import { formattedSize } from '../../features/reagents/utils/formatted-amount';

export function findRemovedSizes(before: Size[], after: Size[]) {
  return before.filter(
    (prevSize) =>
      !after.some((newSize) => prevSize.unit === newSize.unit && prevSize.amount === newSize.amount)
  );
}

export function findItemsOfReagentSizes(reagent: Reagent, sizes: Size[], items: Item[]) {
  // Assume que já carregou
  return items.filter(
    (item) =>
      item.reagentId === reagent.id &&
      sizes.some((size) => formattedSize(size) === formattedSize(item.size))
  );
}

export function findItemsOfReagent(reagent: Reagent, items: Item[]) {
  return items.filter((item) => item.reagentId === reagent.id);
}

export function findItemsOfControlAgency(
  controlAgency: Laboratory,
  reagents: Reagent[],
  items: Item[]
) {
  const relatedReagents = findReagentsOfControlAgency(controlAgency, reagents);
  return relatedReagents.flatMap((reag) => findItemsOfReagent(reag, items));
}

export function findItemsOfLaboratory(laboratory: Laboratory, items: Item[]) {
  return items.filter((item) => item.laboratoryId === laboratory.id);
}

export function findReagentsOfControlAgency(controlAgency: Laboratory, reagents: Reagent[]) {
  return reagents.filter((reag) => reag.controlAgencyId === controlAgency.id);
}

export function findItemsOfBrand(brand: Brand, items: Item[]) {
  return items.filter((item) => item.brandId === brand.id);
}
