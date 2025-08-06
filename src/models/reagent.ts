import Unit from './unit';

export interface Reagent {
  id: string;
  definitionId: string;
  amount: number;
  unit: Unit;
  expireDate: Date | null;
  operationsIds: string[];
}
