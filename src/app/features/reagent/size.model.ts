import { Dimension } from './dimension.model';
import { Unit } from './unit.model';

export interface Size {
  amount: number;
  unit: Unit;
}

export const DimensionDefaultUnit: Record<Dimension, Unit> = {
  [Dimension.Mass]: Unit.Gram,
  [Dimension.Volume]: Unit.Milliliter,
  [Dimension.Count]: Unit.Units,
  [Dimension.Matter]: Unit.Mol,
};

export const UnitDimension: Record<Unit, Dimension> = {
  [Unit.Kilogram]: Dimension.Mass,
  [Unit.Gram]: Dimension.Mass,
  [Unit.Milligram]: Dimension.Mass,
  [Unit.Liter]: Dimension.Volume,
  [Unit.Milliliter]: Dimension.Volume,
  [Unit.Mol]: Dimension.Matter,
  [Unit.Units]: Dimension.Count,
};

export function showSize(value: Size): string {
  return `${value.amount} ${value.unit}`;
}
