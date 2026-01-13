import { Size } from '@/features/size/size.type';
import { DimensionDefaultUnit, UnitDimension, UnitMultiplier } from '@/features/size/unit.type';

export function areSizesEqual(a: Size, b: Size) {
  return a.amount === b.amount && a.unit === b.unit;
}

export function normalizedAmount(size: Size): number {
  const dimension = UnitDimension[size.unit];
  const defaultUnit = DimensionDefaultUnit[dimension];
  const defaultMultiplier = UnitMultiplier[defaultUnit];
  const vialMultiplier = UnitMultiplier[size.unit];

  return (size.amount * vialMultiplier) / defaultMultiplier;
}

export function formattedSize(size: Size) {
  return `${size.amount} ${size.unit}`;
}
