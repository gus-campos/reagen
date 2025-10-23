import { Item } from '../models/item';
import { DimensionDefaultUnit, UnitDimension, UnitMultiplier } from '../models/unit';

export function normalizedAmount(item: Item): number {
  const defaultMultiplier = UnitMultiplier[DimensionDefaultUnit[UnitDimension[item.size.unit]]];
  const itemMultiplier = UnitMultiplier[item.size.unit];

  return (item.size.amount * itemMultiplier) / defaultMultiplier;
}
