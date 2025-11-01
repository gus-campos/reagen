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

// TODO: Mudar enum pra PascalCase
// Se for salvar conteúdo, usar SCREAMING_CASE
// Ver doc oficial do typescript

// Nome de arquivo -> Componente PascalCase,
// outros camelCase,
// node geralmente kebab-case (evita problema em SOs diferentes)

// Divisão em features ou modules -> dentro as divisões

// typing -> models

// Diminuir dependência entre coisas específicas do next
// Fazer pasta page com componente page e exportar em app
// exemplo: página e rotas
// usar wrapper e prop pra pequenas diferenças

export const DimensionDefaultUnit: Record<Dimension, Unit> = {
  [Dimension.MASS]: Unit.GRAM,
  [Dimension.VOLUME]: Unit.MILLILITER,
  [Dimension.COUNT]: Unit.UNITS,
  [Dimension.MATTER]: Unit.MOL,
};

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
