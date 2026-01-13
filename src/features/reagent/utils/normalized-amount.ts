import {
  DimensionDefaultUnit,
  UnitDimension,
  UnitMultiplier,
} from '@/src/features/reagent/types/unit';
import { Size } from '../types/size';

export function normalizedAmount(size: Size): number {
  const dimension = UnitDimension[size.unit];
  const defaultUnit = DimensionDefaultUnit[dimension];
  const defaultMultiplier = UnitMultiplier[defaultUnit];
  const vialMultiplier = UnitMultiplier[size.unit];

  return (size.amount * vialMultiplier) / defaultMultiplier;
}
