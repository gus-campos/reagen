import { Reagent } from '../models/reagent';
import { DimensionDefaultUnit, UnitDimension, UnitMultiplier } from '../models/unit';

export function normalizedAmount(reagent: Reagent): number {
  const defaultMultiplier = UnitMultiplier[DimensionDefaultUnit[UnitDimension[reagent.unit]]];
  const reagentMultiplier = UnitMultiplier[reagent.unit];

  return (reagent.amount * reagentMultiplier) / defaultMultiplier;
}
