import Unit from './unit';

export interface Reagent {
  id: string;
  definitionId: string;
  amount: number;
  unit: Unit;
  purity: number;
  expireDate: Date | null;
  operationsIds: string[];
}
