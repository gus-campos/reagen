export enum Unit {
  KILOGRAM = 'kg',
  GRAM = 'g',
  MILLIGRAM = 'mg',
  LITER = 'L',
  MILLILITER = 'mL',
  MOL = 'mol',
  UNITS = 'un.',
}

export enum Dimension {
  MASS = 'Massa',
  VOLUME = 'Volume',
  COUNT = 'Contagem',
  MATTER = 'Quantidade de matéria',
}

export const UnitDimension: Record<Unit, Dimension> = {
  [Unit.KILOGRAM]: Dimension.MASS,
  [Unit.GRAM]: Dimension.MASS,
  [Unit.MILLIGRAM]: Dimension.MASS,
  [Unit.LITER]: Dimension.VOLUME,
  [Unit.MILLILITER]: Dimension.VOLUME,
  [Unit.MOL]: Dimension.MATTER,
  [Unit.UNITS]: Dimension.COUNT,
};

export const UnitMultiplier: Record<Unit, number> = {
  [Unit.KILOGRAM]: 1000,
  [Unit.GRAM]: 1,
  [Unit.MILLIGRAM]: 0.001,
  [Unit.LITER]: 1,
  [Unit.MILLILITER]: 0.001,
  [Unit.MOL]: 1,
  [Unit.UNITS]: 1,
};

export default Unit;
