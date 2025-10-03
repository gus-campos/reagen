import { Item } from '../models/item';
import { DimensionDefaultUnit, UnitDimension, UnitMultiplier } from '../models/unit';

export function normalizedAmount(item: Item): number {
  const defaultMultiplier = UnitMultiplier[DimensionDefaultUnit[UnitDimension[item.unit]]];
  const itemMultiplier = UnitMultiplier[item.unit];

  return (item.amount * itemMultiplier) / defaultMultiplier;
}
