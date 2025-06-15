import Reagent from '../typings/Reagent';
import ReagentsFilter, { DateField } from '../typings/ReagentsFilter';
import { DimensionDefaultUnit, UnitDimension, UnitMultiplier } from '../typings/Unit';

export function filteredReagent(reagent: Reagent, filter: ReagentsFilter): boolean {
  return filteredDate(reagent, filter) && filteredAmount(reagent, filter);
}

function filteredDate(reagent: Reagent, filter: ReagentsFilter): boolean {
  if (!filter.dateField) return true;

  const reagentDate =
    filter.dateField === DateField.IN_DATE
      ? reagent.inDate
      : filter.dateField == DateField.OUT_DATE
        ? reagent.outDate
        : reagent.expireDate;

  if (!reagentDate) return false;

  if (filter.minDate && reagentDate < filter.minDate) return false;
  if (filter.maxDate && reagentDate > filter.maxDate) return false;

  return true;
}

function filteredAmount(reagent: Reagent, filter: ReagentsFilter): boolean {
  if (!filter.dimension) return true;

  const reagentDimension = UnitDimension[reagent.unit];

  if (reagentDimension !== filter.dimension) return false;

  const normalizedAmount =
    (reagent.amount * UnitMultiplier[reagent.unit]) /
    UnitMultiplier[DimensionDefaultUnit[filter.dimension]];

  console.log(reagent.amount, normalizedAmount);

  if (filter.minAmount && normalizedAmount < filter.minAmount) return false;
  if (filter.maxAmount && normalizedAmount > filter.maxAmount) return false;

  return true;
}

export default filteredReagent;
