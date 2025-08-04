import Unit from './unit';

export interface Reagent {
  id: string | null;
  name: string;
  amount: number;
  unit: Unit;
  inDate: Date | null;
  outDate: Date | null;
  expireDate: Date | null;
}
