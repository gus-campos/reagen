import { Definition } from './definition';
import { Operation } from './operation';
import Unit from './unit';

export interface Reagent {
  id: string;
  definitionId: string;
  amount: number;
  unit: Unit;
  inDate: Date | null;
  outDate: Date | null;
  expireDate: Date | null;
  operations: Operation[];
}
