import { Reagent } from '../models/reagent';
import ReagentsFilter from '../models/reagents-filter';
import { UnitDimension } from '../models/unit';
import { normalizedAmount } from './normalized-amount';

export function filteredReagent(reagent: Reagent, filter: ReagentsFilter): boolean {
  return filteredDate(reagent, filter) && filteredAmount(reagent, filter);
}

function filteredDate(reagent: Reagent, filter: ReagentsFilter): boolean {
  if (!reagent.expireDate) return false;

  if (filter.minDate && reagent.expireDate < filter.minDate) return false;
  if (filter.maxDate && reagent.expireDate > filter.maxDate) return false;

  return true;
}

function filteredAmount(reagent: Reagent, filter: ReagentsFilter): boolean {
  if (!filter.dimension) return true;

  const reagentDimension = UnitDimension[reagent.unit];
  if (reagentDimension !== filter.dimension) return false;

  if (filter.minAmount && normalizedAmount(reagent) < filter.minAmount) return false;
  if (filter.maxAmount && normalizedAmount(reagent) > filter.maxAmount) return false;

  return true;
}
