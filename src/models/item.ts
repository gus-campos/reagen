import Unit from './unit';

export interface Item {
  id: string;
  definitionId: string;
  amount: number;
  unit: Unit;
  purity: number;
  inDate: Date | null;
  expireDate: Date | null;
}
