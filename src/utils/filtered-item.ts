import { Item } from '../models/item';
import ItemsFilter from '../models/items-filter';

export function filteredItem(item: Item, filter: ItemsFilter): boolean {
  const matchesExpiredFilter =
    // Filtro não ativado
    filter.expired === null ||
    // Deve estar vencido e está vencido
    (filter.expired && isExpired(item)) ||
    // Não deve estar vencido e não está vencido
    (!filter.expired && !isExpired(item));

  const itemIsControlled = item.controlAgencyId !== null;
  const matchesControlledFilter =
    // Filtro não ativado
    filter.controled === null ||
    // Deve ser controlado e é controlaod
    (filter.controled && itemIsControlled) ||
    // Não deve ser controlado e não é controlado
    (!filter.controled && !itemIsControlled);

  return (
    matchesControlledFilter &&
    matchesExpiredFilter &&
    insideDateRange(item, filter.minExpire, filter.maxExpire)
  );
}

function insideDateRange(item: Item, minExpire: Date | null, maxExpire: Date | null): boolean {
  if (!item.expireDate) {
    return false;
  }

  if (minExpire && item.expireDate < minExpire) {
    return false;
  }
  if (maxExpire && item.expireDate > maxExpire) {
    return false;
  }

  return true;
}

function isExpired(item: Item): boolean {
  return item.expireDate < new Date();
}
