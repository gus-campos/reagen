import { Unit } from './unit.model';

export enum Dimension {
  Mass = 'MASSA',
  Volume = 'VOLUME',
  Count = 'CONTAGEM',
  Matter = 'QUANTIDADE_DE_MATERIA',
}

export const DimensionDefaultUnit: Record<Dimension, Unit> = {
  [Dimension.Mass]: Unit.Gram,
  [Dimension.Volume]: Unit.Milliliter,
  [Dimension.Count]: Unit.Units,
  [Dimension.Matter]: Unit.Mol,
};
