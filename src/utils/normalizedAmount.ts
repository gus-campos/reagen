import Reagent from '../typings/Reagent';
import { DimensionDefaultUnit, UnitDimension, UnitMultiplier } from '../typings/Unit';

export function normalizedAmount(reagent: Reagent): number {
  const defaultMultiplier = UnitMultiplier[DimensionDefaultUnit[UnitDimension[reagent.unit]]];
  const reagentMultiplier = UnitMultiplier[reagent.unit];

  return reagent.amount * reagentMultiplier / defaultMultiplier;
}

export default normalizedAmount;
