export enum Unit {
  GRAMS = 'g',
  KILOGRAMS = 'Kg',
  LITERS = 'L',
  MILILITERS = 'mL',
  UNITS = 'un.',
}

export const UnitLabels: Record<Unit, string> = {
  [Unit.GRAMS]: 'gramas (g)',
  [Unit.KILOGRAMS]: 'kilogramas (Kg)',
  [Unit.LITERS]: 'litros (L)',
  [Unit.MILILITERS]: 'mililitros (mL)',
  [Unit.UNITS]: 'unidades (un.)',
};

export default Unit;
