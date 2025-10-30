import { Item } from '../models/item';
import { ItemsFilter } from '../models/items-filter';
import { Reagent } from '../models/reagent';

export function filteredItem(
  item: Item,
  getReagentById: (reagentId: string) => Reagent,
  filter: ItemsFilter
): boolean {
  const matchesExpiredFilter =
    // Filtro não ativado
    filter.expired === 'all' ||
    // Deve estar vencido e está vencido
    (filter.expired === 'expired' && isExpired(item)) ||
    // Não deve estar vencido e não está vencido
    (filter.expired === 'not-expired' && !isExpired(item));

  const macthesExpireRangeFilter = isInsideDateRange(item, filter.minExpire, filter.maxExpire);

  const itemControlAgencyId = getReagentById(item.reagentId).controlAgencyId;
  const itemIsControlled = itemControlAgencyId !== null;
  const matchesControlledFilter =
    // Filtro não ativado
    filter.controlled === 'all' ||
    // Deve ser controlado e é controlaod
    (filter.controlled === 'controlled' && itemIsControlled) ||
    // Não deve ser controlado e não é controlado
    (filter.controlled === 'not-controlled' && !itemIsControlled);

  const matchesControlAgencyFilter =
    filter.controlAgencyId === null || filter.controlAgencyId === itemControlAgencyId;

  return (
    matchesExpiredFilter &&
    macthesExpireRangeFilter &&
    matchesControlledFilter &&
    matchesControlAgencyFilter
  );
}

function isInsideDateRange(item: Item, minExpire: Date | null, maxExpire: Date | null): boolean {
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
