import { Item } from '@/src/features/items/types/item';
import {
  DimensionDefaultUnit,
  UnitDimension,
  UnitMultiplier,
} from '@/src/features/reagents/types/unit';

export function normalizedAmount(item: Item): number {
  const dimension = UnitDimension[item.size.unit];
  const defaultUnit = DimensionDefaultUnit[dimension];
  const defaultMultiplier = UnitMultiplier[defaultUnit];
  const itemMultiplier = UnitMultiplier[item.size.unit];

  return (item.size.amount * itemMultiplier) / defaultMultiplier;
}
