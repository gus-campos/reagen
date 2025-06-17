import { Reagent } from '../typings/reagent';
import { DimensionDefaultUnit, UnitDimension, UnitMultiplier } from '../typings/unit';

export function normalizedAmount(reagent: Reagent): number {
  const defaultMultiplier = UnitMultiplier[DimensionDefaultUnit[UnitDimension[reagent.unit]]];
  const reagentMultiplier = UnitMultiplier[reagent.unit];

  return (reagent.amount * reagentMultiplier) / defaultMultiplier;
}
