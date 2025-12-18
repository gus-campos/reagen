import { Dimension } from './dimension.model';

export enum Unit {
  Kilogram = 'KILOGRAM',
  Gram = 'GRAM',
  Milligram = 'MILIGRAM',
  Liter = 'LITER',
  Milliliter = 'MILILITER',
  Mol = 'MOL',
  Units = 'UNIT',
}

export const UnitMultiplier: Record<Unit, number> = {
  [Unit.Kilogram]: 1000,
  [Unit.Gram]: 1,
  [Unit.Milligram]: 0.001,
  [Unit.Liter]: 1,
  [Unit.Milliliter]: 0.001,
  [Unit.Mol]: 1,
  [Unit.Units]: 1,
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
