import { Definition } from './definition';
import Unit from './unit';

export interface Reagent {
  id: string;
  definition: Definition;
  amount: number;
  unit: Unit;
  inDate: Date | null;
  outDate: Date | null;
  expireDate: Date | null;
}
